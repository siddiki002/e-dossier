import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Assessment, Class, Courses, Marks, Officer } from 'src/common/common.types';
import { MatSelectModule } from "@angular/material/select";
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from "@angular/material/button";
import { MatDialog, MatDialogRef, MatDialogContent, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { forkJoin } from 'rxjs';

const assessments = ["Oral - Quiz","Written - Quiz", "Summative - Written", "Summative - Oral", "Formative - Written", "Formative - Oral", "Assignment", "Formative - Practical", "Summative - Practical"];

@Component({
  selector: 'marks-entering',
  imports: [CommonModule, MatSelectModule, FormsModule, MatButtonModule, MatDialogModule, MatInputModule, MatFormFieldModule, MatIconModule, MatCardModule, MatTableModule, MatTooltipModule],
  templateUrl: './marks-entering.html',
  styleUrl: './marks-entering.css'
})
export class MarksEntering {

  protected classId: string = '';
  protected class: Class | null = null;
  protected option: 'pttAssessment' | 'compulsoryModule' | null = null;
  protected courses: Courses[] = [];
  protected selectedCourse: string = '';
  protected addCourseDialogRef: MatDialogRef<any, any> | null = null;
  protected newCourses: Array<{name: string, type: string, module: string, weightage?: number}> = [];
  protected newAssessmentType: string = '';
  protected addAssessmentDialogRef: MatDialogRef<any, any> | null = null;
  protected newAssessmentMarks: string = '';
  protected selectedAssessment: string = '';
  protected assessments: Assessment[] = [];
  protected sailorsInClass: Officer[] = [];
  protected marksList: Marks[] = [];
  protected assessmentMarks : number = 0;
  protected originalAssessmentMarks: number = 0; // Track original value
  protected hasAssessmentMarksChanged: boolean = false; // Track if total marks changed
  protected compulsoryModuleCourseMarks : Record<string, Array<string>> = {}; // officerId -> ["P", "F", "NA"]
  protected modules : Array<{label: string, value: string}> = [
    {label: 'Module I', value: 'Module 1'},
    {label: 'Module II', value: 'Module 2'},
    {label: 'Module III', value: 'Module 3'},
    {label: 'Module IV', value: 'Module 4'},
    {label: 'Module V', value: 'Module 5'},
    {label: 'Module VI', value: 'Module 6'},
    {label: 'Module VII', value: 'Module 7'},
  ];
  protected selectedModule: string = '';
  // Add edit course properties
  protected editCourseDialogRef: MatDialogRef<any, any> | null = null;
  protected editingCourse: {id: string, name: string, type: string, module: string, weightage?: number} | null = null;

  private originalCourseList : Courses[] = [];

  @ViewChild('addCourseDialog') addCourseDialogTemplate: any;
  @ViewChild('addAssessmentDialog') addAssessmentDialogTemplate: any;
  @ViewChild('editCourseDialog') editCourseDialogTemplate: any;

  constructor(private http: HttpClient, private router: Router, private activatedRoute: ActivatedRoute, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.sailorsInClass = this.router?.currentNavigation()?.extras?.state?.['data'] || [];
    this.activatedRoute.params.subscribe(params => {
      this.classId = params['classId'];
      this.option = params['option'];
    });
  }

  ngOnInit() {
    this.fetchCourses();
    this.fetchClassDetails();
  }

  private fetchCourses() {
    if(this.option === 'pttAssessment') {
      this.http.get<Courses[]>(`${baseUrl}/data-entry/course/optional`).subscribe((courses) => {
        this.courses = courses;
        this.originalCourseList = courses;
        if(this.selectedModule){
          this.onModuleSelection(this.selectedModule);
        }
      });
    } else if(this.option === 'compulsoryModule') {
      this.http.get<Courses[]>(`${baseUrl}/data-entry/course/compulsory`).subscribe((courses) => {
        this.courses = courses;
        this.originalCourseList = courses;
      });
    }
  }

  private fetchClassDetails() {
    this.http.get<Class>(`${baseUrl}/class/${this.classId}`).subscribe((classDetails) => {
      this.class = classDetails;
    })
  }

  private fetchAssessments() {
    this.http.get<Assessment[]>(`${baseUrl}/data-entry/assessment/${this.selectedCourse}`).subscribe((assessments) => {
      this.assessments = assessments;
    })
  }

  private fetchOfficerMarksOfAssessment() {
    this.http.get<Marks[]>(`${baseUrl}/data-entry/assessment/${this.selectedAssessment}/marks`, {observe: 'response'}).subscribe((response: HttpResponse<Marks[]>) => {
      if(response.status === 200 && response.body) {
        this.marksList = response.body;
        const updatedSailors : Officer[] = this.sailorsInClass.map((officer) => {
          const officerMarks = this.marksList.find(mark => mark.officerId === officer.id);
          return {
            ...officer,
            marks: officerMarks ? officerMarks.marks : undefined,
            percentage: this.calculatePercentage(officerMarks?.marks ?? null)
          };
        });
        this.sailorsInClass = [...updatedSailors];
      }
    });
  }

  protected onCourseSelection(courseId: string) {
    this.selectedCourse = courseId;
    if(this.option === 'pttAssessment'){
      this.fetchAssessments();
    } else if(this.option === 'compulsoryModule'){
      this.sailorsInClass.forEach((officer) => {
        if(officer?.compulsoryCourses?.length) {
          console.log(officer);
          const courseStatus = officer.compulsoryCourses.find(course => course.courseId === courseId);
          if(courseStatus && courseStatus?.marksArray?.length) {
            this.compulsoryModuleCourseMarks[officer.id] = courseStatus.marksArray;
          } else {
            this.compulsoryModuleCourseMarks[officer.id] = ["-", "-", "-"];
          }
        } else {
          this.compulsoryModuleCourseMarks[officer.id] = ["-", "-", "-"];
        }
      })
    }
  }

  protected addNewCourse() {
    // Initialize with one empty course
    this.newCourses = [{
      name: '',
      type: this.option === 'pttAssessment' ? 'Optional' : 'Compulsory',
      module: ''
    }];
    if(this.option === 'pttAssessment') {
      this.newCourses[0].weightage = 0;
    }
    this.addCourseDialogRef = this.dialog.open(this.addCourseDialogTemplate, {
      width: '500px',
      maxHeight: '80vh'
    });
  }

  protected addMoreCourseFields() {
    this.newCourses.push({
      name: '',
      type: this.option === 'pttAssessment' ? 'Optional' : 'Compulsory',
      module: '',
    });
    if(this.option === 'pttAssessment') {
      this.newCourses[this.newCourses.length - 1].weightage = 0;
    }
  }

  protected removeCourseField(index: number) {
    if (this.newCourses.length > 1) {
      this.newCourses.splice(index, 1);
    }
  }

  protected confirmAddCourse(){
    // Filter out empty courses
    const validCourses = this.newCourses.filter(course => course.name.trim() !== '');
    
    if (validCourses.length === 0) {
      alert('Please enter at least one course name');
      return;
    }

    this.addCourseDialogRef?.close();

    let payload : Array<{courseName: string, module: string, type: string, weightage?: number}> = validCourses.map(course => ({
      courseName: course.name,
      module: course.module,
      type: course.type
    }));

    if(this.option === 'pttAssessment') {
      // Include weightage if option is pttAssessment
      payload = payload.map(course => ({
        ...course,
        weightage: Number(course.weightage) || 0
      }));
    }

    this.http.post(`${baseUrl}/data-entry/courses/bulk`, payload, {observe: 'response'}).subscribe((response : HttpResponse<any>) => {
      if(response.status === 201) {
        this.fetchCourses();
        this.newCourses = [];
        alert(`${validCourses.length} course(s) added successfully!`);
      }
    }, error => {
      console.error('Error adding courses:', error);
      alert('Error adding courses. Please try again.');
    });
  }

  protected editCourse(course: Courses) {
    this.editingCourse = {
      id: course.id,
      name: course.courseName,
      type: course.type,
      module: course.module || '',
      weightage: course.weightage || 0
    };
    
    this.editCourseDialogRef = this.dialog.open(this.editCourseDialogTemplate, {
      width: '500px',
      maxHeight: '80vh'
    });
  }

  protected confirmEditCourse() {
    if (!this.editingCourse || !this.editingCourse.name.trim()) {
      alert('Please enter a course name');
      return;
    }

    this.editCourseDialogRef?.close();

    let payload: any = {
      courseName: this.editingCourse.name,
      module: this.editingCourse.module,
      type: this.editingCourse.type
    };

    if (this.option === 'pttAssessment') {
      payload.weightage = Number(this.editingCourse.weightage) || 0;
    }

    this.http.put(`${baseUrl}/data-entry/course/${this.editingCourse.id}`, payload, {observe: 'response'})
      .subscribe((response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.fetchCourses();
          if (this.selectedModule) {
            this.onModuleSelection(this.selectedModule);
          }
          this.editingCourse = null;
          alert('Course updated successfully!');
        }
      }, error => {
        console.error('Error updating course:', error);
        alert('Error updating course. Please try again.');
      });
  }

  protected getSelectedCourseObject(): Courses | undefined {
    return this.courses.find(course => course.id === this.selectedCourse);
  }

  protected confirmAddAssessment() {
    this.addAssessmentDialogRef?.close();
    const payload =  {
      name: this.newAssessmentType,
      totalMarks: this.newAssessmentMarks
    };
    this.http.post(`${baseUrl}/data-entry/assessment/${this.selectedCourse}`, payload, {observe: 'response'}).subscribe((response: HttpResponse<any>) => {
      this.fetchAssessments()
    })

  }

  protected addAssessment() {
    this.addAssessmentDialogRef = this.dialog.open(this.addAssessmentDialogTemplate);
  }

  protected onAssessmentSelection(assessmentId: string) {
    this.selectedAssessment = assessmentId;
    this.assessmentMarks = this.assessments.find(assessment => assessment.id === assessmentId)?.totalMarks || 0;
    this.originalAssessmentMarks = this.assessmentMarks; // Store original value
    this.hasAssessmentMarksChanged = false; // Reset change flag
    this.fetchOfficerMarksOfAssessment();
  }

  protected get assessmentOptions() {
    return assessments.filter((assessment) => !this.assessments.find(a => a.assessmentName.toLowerCase() === assessment.toLowerCase()));
  }

  protected calculatePercentage(marksObtained: number | null) : string {
    if(!marksObtained) return '0%';
    if(this.assessmentMarks === 0) return '0%';
    const percentage = (marksObtained / this.assessmentMarks) * 100;
    return `${percentage.toFixed(2)}%`;
  }

  protected getPercentageValue(marksObtained: number | null): number {
    if(!marksObtained) return 0;
    if(this.assessmentMarks === 0) return 0;
    return (marksObtained / this.assessmentMarks) * 100;
  }

  protected onMarksChange(officerId: string, newMarks: Event) {
    const marksValue = Number(newMarks);
    if(isNaN(marksValue) || marksValue < 0 || marksValue > this.assessmentMarks) {
      // Reset to previous value if invalid
      const officer = this.sailorsInClass.find(o => o.id === officerId);
      if (officer) {
        const originalMarks = this.marksList.find(mark => mark.officerId === officerId)?.marks || 0;
        officer.marks = originalMarks;
      }
      return;
    }

    const updatedSailors = this.sailorsInClass.map((officer) => {
      if(officer.id === officerId) {
        return {
          ...officer,
          marks: marksValue,
          percentage: this.calculatePercentage(marksValue)
        };
      }
      return officer;
    });
    this.sailorsInClass = [...updatedSailors];
  }

  protected onCompulsoryModuleMarksChange(officerId: string, index: number, newValue: "P" | "F" | "NA") {
    // console.log(officerId, index, newValue);
    const currentMarksArray = this.compulsoryModuleCourseMarks[officerId] || ["-", "-", "-"];
    currentMarksArray[index] = newValue;
    this.compulsoryModuleCourseMarks[officerId] = currentMarksArray;
  }

  protected saveMarks() {
    if(this.option === 'pttAssessment') {
      try{
        // First update assessment total marks if changed
        if(this.hasAssessmentMarksChanged){
          this.updateAssessmentTotalMarks();
        }
          // Then proceed with saving individual marks
          const updateMarksPayload = this.sailorsInClass.map((officer) => {
            const marksId = this.marksList.find(mark => mark.officerId === officer.id)?.id || null;
            if(marksId) {
              return {
                marksId,
                marks: officer?.marks || 0
              }
            }
            return null
          }).filter(item => item !== null);
  
          
          const newMarksPayload = this.sailorsInClass.map((officer) => {
            const marksId = this.marksList.find(mark => mark.officerId === officer.id)?.id || null;
            if(!marksId) {
              return {
                officerId: officer.id,
                marks: officer?.marks || 0
              }
            }
            return null;
          }).filter(item => item !== null);
          
          const calls = {
            putMarks: this.putPttMarks(updateMarksPayload as {marksId: string, marks: number}[]),
            postMarks: this.postPttMarks(newMarksPayload as {officerId: string, marks: number}[])
          }
          forkJoin(calls).subscribe({
            next: (responses) => {
              console.log(responses);
              alert('Marks saved successfully!');
            },
            error: (error) => {
              console.error('Error saving marks:', error);
              alert('Error saving marks. Please try again.');
            }
          });
      }
      catch(error){
        console.error('Error updating assessment total marks:', error);
        alert('Error updating assessment total marks. Please try again.');
      }
    }
    else if (this.option === 'compulsoryModule') {
      const marksPayload = this.sailorsInClass.map((officer) => {
        const marksArray = this.compulsoryModuleCourseMarks[officer.id] || [];
        return {
          officerId: officer.id,
          marks: marksArray,
          courseId: this.selectedCourse
        }
      }).filter(item => item !== null);

      this.postCompulsoryModuleMarks(marksPayload);
    }
  }

  private putPttMarks(marksPayload: {marksId: string, marks: number}[]) {
    return this.http.put(`${baseUrl}/data-entry/marks/update-all`, marksPayload, {observe: 'response'})
  }

  private postPttMarks(marksPayload: {officerId: string, marks: number}[]) {
    return this.http.post(`${baseUrl}/data-entry/marks/optional/update-all/${this.selectedAssessment}`, marksPayload, {observe: 'response'})
  }

  private postCompulsoryModuleMarks(marksPayload: {officerId: string, marks: string[], courseId: string}[]) {
    this.http.put(`${baseUrl}/data-entry/compulsory-marks/update-all`, marksPayload, {observe: 'response'}).subscribe((response: HttpResponse<any>) => {
      console.log(response);
      if(response.status === 200) {
        alert('Marks saved successfully!');
      }
    });
  }

  protected onModuleSelection(moduleValue: string) {
    this.selectedModule = moduleValue;
    const filteredCourses = this.originalCourseList.filter(course => course.module === moduleValue);
    this.courses = [...filteredCourses];
  }

  protected onAssessmentMarksChange(newMarks: number) {
    if (newMarks !== this.originalAssessmentMarks) {
      this.hasAssessmentMarksChanged = true;
      this.assessmentMarks = newMarks;
      // Recalculate all percentages when total marks change
      this.recalculateAllPercentages();
    } else {
      this.hasAssessmentMarksChanged = false;
    }
  }

  private recalculateAllPercentages() {
    this.sailorsInClass = this.sailorsInClass.map(officer => ({
      ...officer,
      percentage: this.calculatePercentage(officer.marks ?? null)
    }));
  }

  private updateAssessmentTotalMarks() {
    const payload = {
      totalMarks: this.assessmentMarks
    };

    this.http.put(`${baseUrl}/data-entry/assessment/${this.selectedAssessment}`, payload, {observe: 'response'})
      .subscribe((response: HttpResponse<any>) => {
        if (response.status === 200) {
          this.originalAssessmentMarks = this.assessmentMarks;
          this.hasAssessmentMarksChanged = false;
          console.log('Assessment total marks updated successfully');
        }
      }, (error) => {
        console.error('Error updating assessment total marks:', error);
        throw error
      });
  }

  protected openEditCourseDialog(course: {id: string, name: string, type: string, module: string, weightage?: number}) {
    this.editingCourse = { ...course };
    this.editCourseDialogRef = this.dialog.open(this.editCourseDialogTemplate, {
      width: '500px',
      maxHeight: '80vh'
    });
  }



}
