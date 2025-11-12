import { Component, ViewChild } from '@angular/core';
import { MatCardModule } from "@angular/material/card";
import { Class, Instructor, Officer } from 'src/common/common.types';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { baseUrl } from 'src/common/base';
import { MatSelectModule } from "@angular/material/select";
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";
import { MatDialog, MatDialogModule } from "@angular/material/dialog";
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { UserService } from '@app/user.service';
import { userType } from '@app/authentication/authentication.const';
import { Subject, takeUntil } from 'rxjs';
import { CommonModule } from '@angular/common';

type Option = {
  name: string;
  route: string;
}

@Component({
  selector: 'ado',
  imports: [RouterModule, CommonModule, MatCardModule, MatSelectModule, SailorListComponent, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './ado.html',
  styleUrls: ['./ado.css', './ado.scss']
})
export class Ado {
  
  protected classes : Class[] = []
  protected selectedClassId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected dialogRef: any;
  protected editDialogRef: any;
  protected deleteDialogRef: any;
  protected newSailorName: string = '';
  protected newSailorId: string = 'OF';
  protected newClassName: string = '';
  protected instructors: Instructor[] = [];
  protected newClassInstructorId: string = '';
  protected clickedClass: Class | null = null;
  protected destroy$: Subject<userType> = new Subject<userType>();
  protected isAdo: boolean = false;

  @ViewChild('addSailorDialog') addSailorDialogTemplate: any;
  @ViewChild('addClassDialog') addClassDialogTemplate: any;
  @ViewChild('selectOptionDialog') selectOptionDialogTemplate: any;
  @ViewChild('editClassDialog') editClassDialogTemplate: any;
  @ViewChild('confirmDeleteDialog') confirmDeleteDialogTemplate: any;


  constructor(private http: HttpClient, private dialog: MatDialog, private router: Router, private userService: UserService) {}

  ngOnInit() {
    this.fetchClasses();
    this.getInstructors();
    this.userService.userType.pipe(takeUntil(this.destroy$)).subscribe((userType) => {
      if(userType === 'ado') {
        this.isAdo = true;
      }
    })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  protected fetchClasses() {
    this.http.get<Class[]>(`${baseUrl}/classes`).subscribe((data) => {
      this.classes = data;
      if(this.classes?.length > 0) {
        this.selectedClassId = this.classes[0].id;
        this.getSailorsInClass(this.selectedClassId);
      }
    })
  }

  protected get selectedClass() : Class | undefined {
    return this.classes.find(c => c.id === this.selectedClassId);
  }

  protected getSailorsInClass(classId: string, callback?: (data: Officer[]) => void) {
    if(!classId) return;
    this.http.get<Officer[]>(`${baseUrl}/class/${classId}/officers`).subscribe((data) => {
      this.sailorsInClass = data;
      if(callback) callback(data);
    })
  }

  protected selectClass(param: Class) {
    this.clickedClass = param;
    if(this.isAdo){
      this.dialogRef = this.dialog.open(this.selectOptionDialogTemplate);
    } else {
      this.getSailorsInClass(param.id, (data) => this.navigateToRoute(`chief-exam/class-overview`, param.id, data));
    }
  }

  protected confirmAddSailor() {
    this.dialogRef.close();
    if(!this.newSailorName) return;
    const body: Partial<Officer> = {
      officerId: this.newSailorId,
      name: this.newSailorName
    }
    this.http.post<{id : string}>(`${baseUrl}/data-entry/officer`, body, {observe: 'response'}).subscribe((response : HttpResponse<{id: string}>) => {
      if(response.status === 201 && response?.body?.id) {
        const newOfficerId = response.body.id;
        // add officer in class too
        this.http.post(`${baseUrl}/data-entry/class/${this.selectedClassId}/officer/${newOfficerId}`, {}, {observe: 'response'}).subscribe((classAdditionResponse : HttpResponse<any>) => {
          if(classAdditionResponse.status === 201) {
            this.sailorsInClass.push({id: newOfficerId,  name: this.newSailorName} as Officer);
            // update officer count in class list
            const classIndex = this.classes.findIndex(c => c.id === this.selectedClassId);
            if(classIndex !== -1) {
              this.classes[classIndex] = {...this.classes[classIndex], numberOfStudents: (this.classes[classIndex].numberOfStudents || 0) + 1};
            }
          }
        })
      }
    })
  }

  protected confirmAddClass() {
    this.dialogRef.close();
    if(!this.newClassName) return;
    const body: Partial<Class> = {
      name: this.newClassName,
      instructorId: this.newClassInstructorId
    }
    this.http.post<{id : string}>(`${baseUrl}/data-entry/class`, body, {observe: 'response'}).subscribe((response : HttpResponse<{id: string}>) => {
      if(response.status === 201 && response?.body?.id) {
        const newClassId = response.body.id;
        this.classes.push({id: newClassId, name: this.newClassName, instructorId: this.newClassInstructorId} as Class);
      }
    })
  }

  protected openAddSailorDialog() {
    this.dialogRef = this.dialog.open(this.addSailorDialogTemplate);
  }
  protected openAddClassDialog() {
    this.dialogRef = this.dialog.open(this.addClassDialogTemplate);
  }

  private getInstructors() {
    this.http.get<Instructor[]>(`${baseUrl}/instructors`).subscribe((data) => {
      this.instructors = data;
    });
  }

  protected onClassSelectionChange(newClassId: string) {
    this.selectedClassId = newClassId;
    this.getSailorsInClass(newClassId);
  }

  protected get options () {
    return [
      {name : "Personal Information", route: "personal-information-entry"},
      {name: "Discipline / Observation", route: "discipline-observation-entry"},
      {name : "PET / SPORTS", route: "pet-sports-entry"},
      {name : 'Medical Records', route: 'medical-records-entry'},
      {name : "Leave Records", route: "leave-records-entry"},
      {name : "Kit item issued", route: "kit-item-issued-entry"},
    ];
  }

  private navigateToRoute(route: string, classId: string, sailorsInClass: Officer[]) {
    this.router.navigate([`dashboard/${route}/${classId}`], {state: {data : sailorsInClass}});
  }

  protected selectOption(option: Option) {
    this.dialogRef.close();
    if(!this.clickedClass) return;
    this.getSailorsInClass(this.clickedClass.id, (data) => this.navigateToRoute(option.route, this.clickedClass!.id, data));
  }

  protected editClass(event: MouseEvent, param: Class) {
    event.stopPropagation();
    this.newClassName = param.name;
    this.newClassInstructorId = param.instructorId || '';
    this.editDialogRef = this.dialog.open(this.editClassDialogTemplate, {data: {class: param}});
  }

  protected confirmEditClass(classToEdit: Class) {
    this.editDialogRef.close();
    if(!this.newClassName) return;
    const className = this.newClassName;
    const instructorIdToUse = this.newClassInstructorId || classToEdit.instructorId;
    const body: Partial<Class> = {
      name: className,
      instructorId: instructorIdToUse
    }
    this.http.put(`${baseUrl}/data-entry/class/${classToEdit.id}`, body, {observe: 'response'}).subscribe((response : HttpResponse<any>) => {
      if(response.status === 200) {
        const classIndex = this.classes.findIndex(c => c.id === classToEdit.id);
        if(classIndex !== -1) {
          this.classes[classIndex] = {...this.classes[classIndex], name: className, instructorId: instructorIdToUse};
        }
      }
    })
    this.newClassName = '';
    this.newClassInstructorId = '';
  }

  protected deleteClass(event:MouseEvent, param: Class) {
    event.stopPropagation();
    this.deleteDialogRef = this.dialog.open(this.confirmDeleteDialogTemplate, {data: {class: param}});
  }

  protected confirmDeleteClass(classToDelete: Class) {
    this.deleteDialogRef.close();
    this.http.delete(`${baseUrl}/data-entry/class/${classToDelete.id}`, {observe: 'response'}).subscribe((response : HttpResponse<any>) => {
      if(response.status === 200) {
        const classIndex = this.classes.findIndex(c => c.id === classToDelete.id);
        if(classIndex !== -1) {
          this.classes.splice(classIndex, 1);
        }
      }
    })
  }

}
