import { Component, TemplateRef, ViewChild } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import { Class, Course } from 'src/common/common.types';
import { classes, courses } from 'src/static/data';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'data-entry',
  imports: [MatCardModule, MatButtonModule, CommonModule, MatDialogModule, MatListModule],
  templateUrl: './data-entry.html',
  styleUrl: './data-entry.css'
})
export class DataEntry {

  @ViewChild('courseSelectionDialog') courseSelectionDialog!: TemplateRef<any>;

  protected classes : Class[] = []
  protected courses : Course[] = []
  protected selectedClass : Class | null = null;
  

  private _dialogRef!: MatDialogRef<any,any>;

  constructor(private router: Router, private dialog: MatDialog) {
    // Currently hardcoding classes, in real application this data would come from a backend service
    this.classes = classes;
    this.courses = courses;
  }

  navigateToClass(classId: string) {
    this.router.navigate(['dashboard/class', classId], {
    });
  }

  openDialog(classId: string) {
    this.selectedClass = this.classes.find(c => c.id === classId) || null;
    this._dialogRef = this.dialog.open(this.courseSelectionDialog);
  }

  selectCourse(courseId: string) {
    this._dialogRef.close(courseId);
    this.router.navigate(['dashboard/class', this.selectedClass?.id], { queryParams: { courseId } });
  }

}
