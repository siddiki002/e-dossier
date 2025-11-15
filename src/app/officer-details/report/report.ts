import { CommonModule } from '@angular/common';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Courses, Officer } from 'src/common/common.types';

type MarksInOptionalCourse = {
  [assessmentName: string] : {
    courseId: string;
    assessmentMarks: number;
    obtainedMarks: number;
  }
}

@Component({
  selector: 'report',
  imports: [CommonModule],
  templateUrl: './report.html',
  styleUrl: './report.css'
})
export class Report {

  protected officerId: string = '';
  protected officer: Officer | null = null;
  protected optionalCourses: Courses[] = [];
  protected marksInOptionalCourses: MarksInOptionalCourse = {};
  protected totalMarks: number = 0;
  protected obtainedMarks: number = 0;

  constructor(private activatedRouter: ActivatedRoute, private http: HttpClient) {
    this.activatedRouter.params.subscribe(params => {
      this.officerId = params['officerId'];
    });
  }

  ngOnInit() {
    this.fetchAllOptionalCourses();
    this.getMarksOfOfficerInOptionalCourses();
    this.getOfficerDetails();
  }

  private getOfficerDetails() {
    this.http.get<Officer>(`${baseUrl}/data-entry/officer/${this.officerId}`).subscribe((data) => {
      this.officer = data;
    });
  }

  private fetchAllOptionalCourses() {
    this.http.get<Courses[]>(`${baseUrl}/data-entry/course/optional`, {observe: 'response'}).subscribe((response : HttpResponse<Courses[]>) => {
      this.optionalCourses = response.body || [];
    });
  }

  private getMarksOfOfficerInOptionalCourses() {
    this.http.get<{result : MarksInOptionalCourse}>(`${baseUrl}/data-entry/officer/${this.officerId}/assessments`).subscribe((response) => {
      this.marksInOptionalCourses = response.result;
    });
  }

  protected getObtainedMarks(courseId: string, assessmentName: string): number | string {
    if(assessmentName in this.marksInOptionalCourses) {
      const assessmentDetails = this.marksInOptionalCourses[assessmentName];
      if(assessmentDetails.courseId === courseId) {
        return assessmentDetails.obtainedMarks;
      }
    }
    return '-'
  }

  protected getTotalMarks(courseId: string) : number | string {
    let totalMarks = 0;
    for(const assessmentName in this.marksInOptionalCourses) {
      const assessmentDetails = this.marksInOptionalCourses[assessmentName];
      if(assessmentDetails.courseId === courseId) {
        totalMarks += assessmentDetails.assessmentMarks
      }
    }
    return totalMarks > 0 ? totalMarks : '-';
  }

  protected getObtainedMarksForCourse(courseId: string) : number | string {
    let obtainedMarks = 0;
    for(const assessmentName in this.marksInOptionalCourses) {
      const assessmentDetails = this.marksInOptionalCourses[assessmentName];
      if(assessmentDetails.courseId === courseId) {
        obtainedMarks += assessmentDetails.obtainedMarks
      }
    }
    return obtainedMarks > 0 ? obtainedMarks : '-'
  }

  protected getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  }

  protected getPercentage(courseId: string): number {
    const total = this.getTotalMarks(courseId);
    const obtained = this.getObtainedMarksForCourse(courseId);
    
    if (typeof total === 'number' && typeof obtained === 'number' && total > 0) {
      return Math.round((obtained / total) * 100);
    }
    return 0;
  }

  protected getOverallPercentage(): number {

    let totalPercentageByCourse = 0;
    let courseWithZeroMarks = 0;
    this.optionalCourses.forEach((course) => {
      const coursePercentage = this.getPercentage(course.id);
      if(coursePercentage === 0) {
        courseWithZeroMarks += 1;
      }
      totalPercentageByCourse += coursePercentage;
    });

    if (this.optionalCourses.length > 0) {
      return Math.round(totalPercentageByCourse / (this.optionalCourses.length - courseWithZeroMarks));
    }
    return 0;
  }

  protected getOverallGrade(): string {
    const percentage = this.getOverallPercentage();
    
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  }

  protected getOfficerRank(): string {
    return (this.officer as any)?.rank || 'Not Specified';
  }

  protected getOfficerDepartment(): string {
    return (this.officer as any)?.department || 'Not Specified';
  }

}
