import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Officer, Pet } from 'src/common/common.types';

@Component({
  selector: 'pet',
  imports: [CommonModule, FormsModule],
  templateUrl: './pet.html',
  styleUrl: './pet.css'
})
export class PetRecords {

  protected officerId: string = '';
  protected officerDetails: Officer | null = null;
  protected officerPetRecords: Pet[] = [];
  protected defaultImage: string = 'default-image.png';

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent?.params?.subscribe(params => {
      this.officerId = params['id'];
    });
  }

  ngOnInit(){
    this.fetchOfficerDetails();
    this.fetchOfficerPetRecords();
  }

  private fetchOfficerDetails() {
    this.http.get<Officer>(`${baseUrl}/data-entry/officer/${this.officerId}`).subscribe((data) => {
      this.officerDetails = data;
    })
  }

  private fetchOfficerPetRecords() {
    this.http.get<Pet[]>(`${baseUrl}/data-entry/officer/${this.officerId}/pets`).subscribe((data) => {
      this.officerPetRecords = data;
    })
  }

  // Helper methods for template
  protected getTotalRecordsCount(): number {
    const petCount = this.officerDetails?.pet?.length || 0;
    const recordsCount = this.officerPetRecords?.length || 0;
    return petCount + recordsCount;
  }

  protected hasAnyPetRecords(): boolean {
    return this.getTotalRecordsCount() > 0;
  }

  protected getPercentage(obtained: number, total: number): number {
    if (!total || total === 0) return 0;
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

  protected getRemarkClass(remarks: string | undefined): string {
    if (!remarks) return 'neutral';
    const lower = remarks.toLowerCase();
    if (lower.includes('excellent') || lower.includes('outstanding')) return 'positive';
    if (lower.includes('good') || lower.includes('satisfactory')) return 'positive';
    if (lower.includes('poor') || lower.includes('unsatisfactory')) return 'negative';
    if (lower.includes('needs improvement') || lower.includes('below')) return 'warning';
    return 'neutral';
  }

}
