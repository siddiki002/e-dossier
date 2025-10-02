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

@Component({
  selector: 'marks-entering-screen',
  imports: [MatListModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule, MatDialogContent, MatDialogActions],
  templateUrl: './marks-entering-screen.html',
  styleUrl: './marks-entering-screen.css'
})
export class MarksEnteringScreen implements OnInit {

  @ViewChild('successDialog') successDialog!: TemplateRef<any>;

  protected totalMarksInCourse: number = 100;
  protected officersInClass: Officer[] = [];
  protected courseName: string = '';
  protected className: string = '';
  protected marksOfEachOfficer: {[officerId: string]: number} = {};
  
  private _classId!: string;
  private _courseId!: string;
  private _dialogRef!: MatDialogRef<any,any>;

  get classId() {
    return this._classId;
  }

  get courseId() {
    return this._courseId;
  }

  get dialogRef() {
    return this._dialogRef;
  }

  constructor(private activatedRoute: ActivatedRoute, private router: Router, private dialog: MatDialog) {
    this.activatedRoute.params.subscribe(params => {
      this._classId = params['id'];
    });
    this.activatedRoute.queryParams.subscribe(queryParams => {
      this._courseId = queryParams['courseId'];
    });
  }

  private getCourseName(courseId: string): string {
    const course = courses.find(c => c.id === courseId);
    return course ? course.name : '';
  }

  private getClassName(classId: string): string {
    const classItem = classes.find(c => c.id === classId);
    return classItem ? classItem.name : '';
  }

  ngOnInit() {
    if(!this._classId || !this._courseId) return;

    // Get the list of officers enrolled in this class
    this.officersInClass.push(...officers.filter(officer => officer.classId.includes(this._classId)));
    this.courseName = this.getCourseName(this._courseId);
    this.className = this.getClassName(this._classId);
    this.officersInClass.forEach(officer => {
      this.marksOfEachOfficer[officer.id] = officer.courseMarks.find(cm => cm.courseId === this._courseId)?.marks || 0;
    });
  }

  updateOfficerMarks(officerId: string, marks: string) {
    this.marksOfEachOfficer[officerId] = parseFloat(marks);
  }

  navigateToDashboard() {
    this.router.navigate(['dashboard/data-entry']);
  }

  saveMarks() {
    // Send the marks to backend to save
    // For now just updating the local copy
    this._dialogRef = this.dialog.open(this.successDialog);

    this._dialogRef.afterClosed().subscribe(() => this.navigateToDashboard());
  }
}
