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
import { CdkNoDataRow } from "@angular/cdk/table";

type Option = {
  name: string;
  route: string;
}

@Component({
  selector: 'ado',
  imports: [MatCardModule, MatSelectModule, SailorListComponent, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, CdkNoDataRow],
  templateUrl: './ado.html',
  styleUrls: ['./ado.css', './ado.scss']
})
export class Ado {
  
  protected classes : Class[] = []
  protected selectedClassId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected dialogRef: any;
  protected newSailorName: string = '';
  protected newClassName: string = '';
  protected instructors: Instructor[] = [];
  protected newClassInstructorId: string = '';
  

  @ViewChild('addSailorDialog') addSailorDialogTemplate: any;
  @ViewChild('addClassDialog') addClassDialogTemplate: any;
  @ViewChild('selectOptionDialog') selectOptionDialogTemplate: any;


  constructor(private http: HttpClient, private dialog: MatDialog) {}
  
  ngOnInit() {
    this.fetchClasses();
  }

  protected fetchClasses() {
    this.http.get<Class[]>(`${baseUrl}/classes`).subscribe((data) => {
      this.classes = data;
      if(this.classes?.length > 0) {
        this.selectedClassId = this.classes[0].id;
        this.getSailorsInClass();
      }
    })
  }

  protected get selectedClass() : Class | undefined {
    return this.classes.find(c => c.id === this.selectedClassId);
  }

  protected getSailorsInClass() {
    if(!this.selectedClassId) return;
    this.http.get<Officer[]>(`${baseUrl}/class/${this.selectedClassId}/officers`).subscribe((data) => {
      this.sailorsInClass = data;
    })
  }

  protected selectClass(param: Class) {
    this.dialogRef = this.dialog.open(this.selectOptionDialogTemplate);
  }

  protected confirmAddSailor() {
    this.dialogRef.close();
    console.log('Adding New Sailor:', this.newSailorName);
    if(!this.newSailorName) return;
    const body: Partial<Officer> = {
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
    console.log('Adding New Class:', this.newClassName);
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
    this.getInstructors();
  }

  private getInstructors() {
    this.http.get<Instructor[]>(`${baseUrl}/instructors`).subscribe((data) => {
      console.log('Instructors fetched:', data);
      this.instructors = data;
    });
  }

  protected onClassSelectionChange(newClassId: string) {
    this.selectedClassId = newClassId;
    this.getSailorsInClass();
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

  protected selectOption(option: Option) {
    console.log('Selected Option:', option);
  }

}
