import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '@app/user.service';
import { baseUrl } from 'src/common/base';
import { Officer, TraitsAssessment } from 'src/common/common.types';

export interface TraitFormData {
  traitName: string;
  tap1Total: number;
  tap1Obtained: number;
  tap2Total: number;
  tap2Obtained: number;
}

@Component({
  selector: 'traits-assessment',
  imports: [CommonModule, FormsModule],
  templateUrl: './traits-assessment.html',
  styleUrl: './traits-assessment.css'
})
export class TraitsAssessmentComponent {

  protected officerId: string = '';
  protected officerDetails: Officer | null = null;
  protected officerTraitsAssessment: TraitsAssessment[] = [];
  protected isOic: boolean = false;
  
  protected traits = [
    'Professional and practical knowledge',
    'Proficiency in duties deployed',
    'Boldness, courage and stamina',
    'Attitude towards services',
    'Integrity & moral values',
    'Sense of duty and readiness to accept responsibility',
    'Discipline',
    'Phyical fitness and military bearing',
    'Intelligence, mental alertness',
    'Adaptability'
  ];

  protected formData: TraitFormData[] = [];
  protected tap1TotalMarks: number = 10;
  protected tap2TotalMarks: number = 10;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private userService: UserService) {
    this.userService.userType.subscribe(role => {
      this.isOic = (role === 'oic');
    });
    this.activatedRoute.parent?.params?.subscribe(params => {
      this.officerId = params['id'];
    });
    this.initializeFormData();
  }

  ngOnInit() {
    this.fetchOfficerDetails();
    this.fetchOfficerTraitsAssessment();
  }

  private initializeFormData() {
    this.formData = this.traits.map(trait => ({
      traitName: trait,
      tap1Total: 10,
      tap1Obtained: 0,
      tap2Total: 10,
      tap2Obtained: 0
    }));
  }

  private fetchOfficerDetails() {
    this.http.get<Officer>(`${baseUrl}/data-entry/officer/${this.officerId}`).subscribe((data) => {
      this.officerDetails = data;
    });
  }

  private fetchOfficerTraitsAssessment() {
    this.http.get<TraitsAssessment[]>(`${baseUrl}/data-entry/officer/${this.officerId}/traits-assessments`).subscribe((data) => {
      this.officerTraitsAssessment = data;
      this.populateFormFromExistingData();
    });
  }

  private populateFormFromExistingData() {
    if (this.officerTraitsAssessment.length === 0) return;

    this.officerTraitsAssessment.forEach(assessment => {
      const formIndex = this.formData.findIndex(item => 
        item.traitName.toLowerCase() === assessment.traitName.toLowerCase()
      );
      
      if (formIndex !== -1) {
        if (assessment.tap === 1) {
          this.formData[formIndex].tap1Total = assessment.total;
          this.formData[formIndex].tap1Obtained = assessment.score;
        } else if (assessment.tap === 2) {
          this.formData[formIndex].tap2Total = assessment.total;
          this.formData[formIndex].tap2Obtained = assessment.score;
        }
      }
    });
  }

  // Helper methods for template
  protected onTap1TotalChange(value: number) {
    // Prevent changes in OIC readonly mode
    if (this.isOic) return;
    
    this.tap1TotalMarks = value;
    this.formData.forEach(item => {
      item.tap1Total = value;
    });
  }

  protected onTap2TotalChange(value: number) {
    // Prevent changes in OIC readonly mode
    if (this.isOic) return;
    
    this.tap2TotalMarks = value;
    this.formData.forEach(item => {
      item.tap2Total = value;
    });
  }

  protected getTap1TotalSum(): number {
    return this.formData.reduce((sum, item) => sum + item.tap1Total, 0);
  }

  protected getTap1ObtainedSum(): number {
    return this.formData.reduce((sum, item) => sum + item.tap1Obtained, 0);
  }

  protected getTap2TotalSum(): number {
    return this.formData.reduce((sum, item) => sum + item.tap2Total, 0);
  }

  protected getTap2ObtainedSum(): number {
    return this.formData.reduce((sum, item) => sum + item.tap2Obtained, 0);
  }

  protected getGrandTotalSum(): number {
    return this.getTap1TotalSum() + this.getTap2TotalSum();
  }

  protected getGrandObtainedSum(): number {
    return this.getTap1ObtainedSum() + this.getTap2ObtainedSum();
  }

  protected getPercentage(obtained: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((obtained / total) * 100);
  }

  protected getPerformanceClass(obtained: number, total: number): string {
    const percentage = this.getPercentage(obtained, total);
    if (percentage >= 90) return 'excellent';
    if (percentage >= 80) return 'good';
    if (percentage >= 70) return 'average';
    if (percentage >= 60) return 'below-average';
    return 'poor';
  }

  protected getPerformance(obtained: number, total: number): string {
    const percentage = this.getPercentage(obtained, total);
    if (percentage >= 90) return 'EXCELLENT';
    if (percentage >= 80) return 'GOOD';
    if (percentage >= 70) return 'AVERAGE';
    if (percentage >= 60) return 'BELOW AVERAGE';
    return 'NEEDS IMPROVEMENT';
  }

  protected saveAssessment() {
    // Prevent saving in OIC readonly mode
    if (this.isOic) {
      console.log('Save operation not allowed in OIC readonly mode');
      return;
    }

    const assessmentData: TraitsAssessment[] = [];

    this.formData.forEach(item => {
      // Add TAP 1 entry
      assessmentData.push({
        officerId: this.officerId,
        tap: 1,
        traitName: item.traitName,
        score: item.tap1Obtained,
        total: item.tap1Total
      });

      // Add TAP 2 entry
      assessmentData.push({
        officerId: this.officerId,
        tap: 2,
        traitName: item.traitName,
        score: item.tap2Obtained,
        total: item.tap2Total
      });
    });

    // For now, console log the data
    console.log('Traits Assessment Data to be sent to backend:', assessmentData);

    // TODO: Implement actual API call
    this.http.post(`${baseUrl}/data-entry/officer/${this.officerId}/traits-assessments`, assessmentData)
      .subscribe(response => {
        console.log('Assessment saved successfully', response);
        alert('Traits Assessment saved successfully.');
      });
  }

  protected resetForm() {
    // Prevent reset in OIC readonly mode
    if (this.isOic) {
      console.log('Reset operation not allowed in OIC readonly mode');
      return;
    }

    this.initializeFormData();
    this.tap1TotalMarks = 10;
    this.tap2TotalMarks = 10;
  }
}
