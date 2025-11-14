import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Class, Courses, Officer } from 'src/common/common.types';
import { MatSelectModule } from "@angular/material/select";
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";
import { FormsModule } from '@angular/forms';
import { MatCardModule } from "@angular/material/card";

type FailedCourses = {
  [courseId: string]: Officer[];
}


@Component({
  selector: 'class-overview',
  imports: [RouterModule, MatSelectModule, SailorListComponent, FormsModule, MatCardModule],
  templateUrl: './class-overview.html',
  styleUrl: './class-overview.css'
})
export class ClassOverview {

  protected classId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected failedCompulsoryCourses: FailedCourses = {};
  protected failedOptionalCourses: FailedCourses = {};
  protected courses: Courses[] = [];
  protected selectedPttCourse: string = '';
  protected selectedCompulsoryCourse: string = '';
  protected classDetails: Class | undefined = undefined;
  protected failedOfficerInCompulsoryCourse: Officer[] = [];
  protected failedOfficerInPttCourse: Officer[] = [];

  constructor(private router: Router, private http: HttpClient, private activatedRouter: ActivatedRoute) {
    this.sailorsInClass = this.router?.currentNavigation()?.extras?.state?.['data'] || [];
    this.activatedRouter?.params?.subscribe((params) => {
      this.classId = params['id'];
    })
  }

  ngOnInit() {
    this.fetchClassDetails();
    this.fetchAllCourses();
    this.fetchFailedCompulsoryCourses();
    this.fetchFailedOptionalCourses();
  }

  private fetchFailedOptionalCourses() {
    this.http.get<{failedOfficersDetails : FailedCourses}>(`${baseUrl}/data-entry/class/${this.classId}/failed-optional-courses`).subscribe(({failedOfficersDetails}) => {
      console.log(failedOfficersDetails);
      this.failedOptionalCourses = failedOfficersDetails;
    });
  }

  private fetchFailedCompulsoryCourses() {
    this.http.get<{failedCourses: FailedCourses}>(`${baseUrl}/data-entry/class/${this.classId}/failed-compulsory-courses`).subscribe(({failedCourses}) => {
      this.failedCompulsoryCourses = failedCourses; 
    });
  }

  private fetchAllCourses() {
    this.http.get<Courses[]>(`${baseUrl}/data-entry/course`, {observe: 'response'}).subscribe((response : HttpResponse<Courses[]>) => {
      if(response.status === 200 && response.body) {
        this.courses = response.body;
      }
    });
  }

  private fetchClassDetails() {
    this.http.get<Class>(`${baseUrl}/class/${this.classId}`, {observe: 'response'}).subscribe((response : HttpResponse<Class>) => {
      if(response.status === 200 && response.body) {
        this.classDetails = response.body;;
      }
    }); 
  }

  protected get compulsoryCourses() : Courses[] {
    return this.courses.filter((course) => course.type === "Compulsory");
  }

  protected get optionalCourses() : Courses[] {
    return this.courses.filter((course) => course.type === "Optional");
  }

  protected onPttCourseSelectionChange(courseId: string) {
    this.selectedPttCourse = courseId;
    this.failedOfficerInPttCourse = this.failedOptionalCourses[courseId] || [];
  }

  protected onCompulsoryCourseSelectionChange(courseId: string) {
    this.selectedCompulsoryCourse = courseId;
    this.failedOfficerInCompulsoryCourse = this.failedCompulsoryCourses[courseId] || [];
  }

  protected selectOption(option: 'pttAssessment' | 'compulsoryModule'){
    this.router?.navigate(['dashboard/chief-exam/marks-entering', this.classId, option], { state: { data: this.sailorsInClass } });
  }

}
