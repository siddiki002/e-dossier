import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Officer } from 'src/common/common.types';
import { classes, courses, officers } from 'src/static/data';
import { MatListModule } from '@angular/material/list';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogContent, MatDialogActions, MatDialogRef } from '@angular/material/dialog';
import {MatSelectModule} from '@angular/material/select';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'marks-entering-screen',
  imports: [MatListModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatDialogContent, MatDialogActions, MatSelectModule, CommonModule],
  templateUrl: './marks-entering-screen.html',
  styleUrl: './marks-entering-screen.css'
})
export class MarksEnteringScreen implements OnInit {

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;

  protected totalMarksInCourse: number = 100;
  protected officersInClass: Officer[] = [];
  protected className: string = '';
  protected marksOfEachOfficer: {[officerId: string]: number} = {};
  protected selectedCourseId: string = '';
  protected selectedAssessmentType: {key: string, value: string} = {key: '', value: ''};
  protected courseList = courses;
  protected assessmentTypeList: {key: string, value: string}[] = [
    {
      key: 'quiz',
      value: 'Quiz'
    },
    {
      key: 'assignment',
      value: 'Assignments'
    },
    {
      key: 'formative_test',
      value: 'Formative Test'
    },
    {
      key: 'finals',
      value: 'Finals'
    }
  ]
  
  
  private _classId!: string;
  private _dialogRef!: MatDialogRef<any,any>;

  get classId() {
    return this._classId;
  }

  get dialogRef() {
    return this._dialogRef;
  }

  get courseName() : string {
    const course = this.courseList.find(c => c.id === this.selectedCourseId);
    return course ? course.name : '';
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.activatedRoute.params.subscribe(params => {
      this._classId = params['id'];
    });
  }

  private getClassName(classId: string): string {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : '';
  }

  ngOnInit() {
    if(!this._classId) return;

    // Get the list of officers enrolled in this class
    this.officersInClass.push(...officers.filter(officer => officer.classId.includes(this._classId)));
    this.className = this.getClassName(this._classId);
  }

  updateOfficerMarks(officerId: string, marks: string) {
    this.marksOfEachOfficer[officerId] = parseFloat(marks);
  }

  navigateToDashboard() {
    this.router.navigate(['dashboard/data-entry']);
  }

  saveMarks() {
    // TODO: Send the marks to backend to save
    // For now save the marks in browser local storage for demo purpose
    Object.keys(this.marksOfEachOfficer).forEach(officerId => {
      const currentMarks = officers.find(o => o.id === officerId)?.courseMarks;
      if(currentMarks) {
        const otherCoursesMarks = currentMarks.filter(cm => cm.courseId !== this.selectedCourseId);
        otherCoursesMarks.push({courseId: this.selectedCourseId, marks: parseFloat(this.marksOfEachOfficer[officerId].toString())});
        localStorage.setItem(officerId, JSON.stringify(otherCoursesMarks));
      }
    })
    this._dialogRef = this.dialog.open(this.successDialog);

    this._dialogRef.afterClosed().subscribe(() => this.navigateToDashboard());
  }

  onCourseSelection(courseId: string) {
    this.selectedCourseId = courseId;
    this.officersInClass.forEach(officer => {
      const marksInLocalStorage = JSON.parse(localStorage.getItem(officer.id) || '[]') as {courseId: string, marks: number}[];
      if(marksInLocalStorage.length) {
        this.marksOfEachOfficer[officer.id] = marksInLocalStorage.find((cm: {courseId: string, marks: number}) => cm.courseId === this.selectedCourseId)?.marks || 0;
        return;
      }
      this.marksOfEachOfficer[officer.id] = officer.courseMarks.find(cm => cm.courseId === this.selectedCourseId)?.marks || 0;
    });
  }
}
