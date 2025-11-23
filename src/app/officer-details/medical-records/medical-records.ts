import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Medical, Officer } from 'src/common/common.types';

@Component({
  selector: 'medical-records',
  imports: [CommonModule, FormsModule],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecords {

  protected officerId: string = '';
  protected officerDetails: Officer | null = null;
  protected medicalRecords: Medical[] = [];

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent?.params?.subscribe(params => {
      this.officerId = params['id'];
    });
  }

  ngOnInit() {
    this.fetchOfficerDetails();
    this.fetchMedicalRecords();
  }

  private fetchOfficerDetails() {
    this.http.get<Officer>(`${baseUrl}/data-entry/officer/${this.officerId}`).subscribe((data) => {
      this.officerDetails = data;
    });
  }

  private fetchMedicalRecords() {
    this.http.get<Medical[]>(`${baseUrl}/data-entry/officer/${this.officerId}/medical`).subscribe((data) => {
      console.log(data);
      this.medicalRecords = data;
    });
  }

  // Helper methods for template
  protected formatDate(dateString: string | Date): string | Date {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    } catch {
      return dateString;
    }
  }

  protected getTimeAgo(dateString: string | Date): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now.getTime() - date.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 0) return 'Today';
      if (diffDays === 1) return '1 day ago';
      if (diffDays < 30) return `${diffDays} days ago`;
      if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
      return `${Math.floor(diffDays / 365)} years ago`;
    } catch {
      return '';
    }
  }

  protected getDiseaseClass(disease: string): string {
    if (!disease) return 'unknown';
    const lower = disease.toLowerCase();
    
    if (lower.includes('chronic') || lower.includes('diabetes') || lower.includes('hypertension')) return 'chronic';
    if (lower.includes('acute') || lower.includes('fever') || lower.includes('infection')) return 'acute';
    if (lower.includes('injury') || lower.includes('fracture') || lower.includes('wound')) return 'injury';
    if (lower.includes('mental') || lower.includes('stress') || lower.includes('anxiety')) return 'mental';
    
    return 'general';
  }

  protected getDiseaseCategory(disease: string): string {
    if (!disease) return 'General';
    const lower = disease.toLowerCase();
    
    if (lower.includes('heart') || lower.includes('cardiac')) return 'Cardiovascular';
    if (lower.includes('lung') || lower.includes('respiratory')) return 'Respiratory';
    if (lower.includes('bone') || lower.includes('joint') || lower.includes('muscle')) return 'Musculoskeletal';
    if (lower.includes('mental') || lower.includes('psychological')) return 'Mental Health';
    if (lower.includes('skin') || lower.includes('dermat')) return 'Dermatological';
    if (lower.includes('eye') || lower.includes('vision')) return 'Ophthalmological';
    if (lower.includes('ear') || lower.includes('hearing')) return 'ENT';
    
    return 'General Medicine';
  }

  protected getSeverityClass(disease: string): string {
    if (!disease) return 'low';
    const lower = disease.toLowerCase();
    
    if (lower.includes('severe') || lower.includes('critical') || lower.includes('emergency')) return 'high';
    if (lower.includes('moderate') || lower.includes('chronic')) return 'medium';
    if (lower.includes('mild') || lower.includes('minor')) return 'low';
    
    // Default severity based on disease type
    if (lower.includes('fever') || lower.includes('cold')) return 'low';
    if (lower.includes('fracture') || lower.includes('surgery')) return 'high';
    
    return 'medium';
  }

  protected getSeverityLevel(disease: string): string {
    const severityClass = this.getSeverityClass(disease);
    switch (severityClass) {
      case 'high': return 'High';
      case 'medium': return 'Medium';
      case 'low': return 'Low';
      default: return 'Unknown';
    }
  }

  protected getRemarkType(remarks: string): string {
    if (!remarks) return '';
    const lower = remarks.toLowerCase();
    
    if (lower.includes('cleared') || lower.includes('recovered')) return 'Positive';
    if (lower.includes('ongoing') || lower.includes('monitoring')) return 'Ongoing';
    if (lower.includes('concern') || lower.includes('serious')) return 'Attention';
    
    return 'Note';
  }

  protected getStatusClass(disease: string, remarks: string): string {
    if (!remarks) return 'pending';
    const lower = remarks.toLowerCase();
    
    if (lower.includes('cleared') || lower.includes('recovered') || lower.includes('fit')) return 'cleared';
    if (lower.includes('ongoing') || lower.includes('monitoring') || lower.includes('treatment')) return 'ongoing';
    if (lower.includes('serious') || lower.includes('critical') || lower.includes('unfit')) return 'serious';
    
    return 'pending';
  }

  protected getRecordStatus(disease: string, remarks: string): string {
    const statusClass = this.getStatusClass(disease, remarks);
    switch (statusClass) {
      case 'cleared': return 'Cleared';
      case 'ongoing': return 'Ongoing';
      case 'serious': return 'Serious';
      case 'pending': return 'Under Review';
      default: return 'Unknown';
    }
  }

}
