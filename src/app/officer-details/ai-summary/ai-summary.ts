import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Officer } from 'src/common/common.types';
import { MatProgressSpinnerModule } from "@angular/material/progress-spinner";
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ai-summary',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './ai-summary.html',
  styleUrl: './ai-summary.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AiSummary {

  protected officerId: string = '';
  protected officer: Officer | null = null;
  protected aiSummary: string = '';
  protected loadingSummary: boolean = true;

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.officerId = params['id'];
    })
  }

  ngOnInit() {
    this.fetchOfficerDetails();
    this.fetchOfficerAISummary();
  }

  private fetchOfficerDetails() {
    this.http.get<Officer>(`${baseUrl}/data-entry/officer/${this.officerId}`).subscribe({
      next: (data) => {
        this.officer = data;
      },
      error: (error) => {
        console.error('Error fetching officer details:', error);
        this.loadingSummary = false;
        history.back();
      }
    });
  }

  private fetchOfficerAISummary() {
    this.http.get<{aiSummary: string}>(`${baseUrl}/officer/${this.officerId}/ai-summary`).subscribe({
      next: (response) => {
        this.aiSummary = response.aiSummary;
        console.log('Fetched AI Summary:', this.aiSummary);
        this.loadingSummary = false;
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching AI summary:', error);
        this.aiSummary = 'Failed to generate AI summary. Please try again later.';
        this.loadingSummary = false;
      }
    });
  }

  protected formatSummaryText(text: string): string {
    if (!text) return '';
    
    // Convert line breaks to HTML paragraphs
    const paragraphs = text.split('\n\n').filter(p => p.trim());
    
    const html = paragraphs
      .map(paragraph => {
        // Handle bullet points
        if (paragraph.includes('•') || paragraph.includes('-')) {
          const lines = paragraph.split('\n');
          const listItems = lines
            .filter(line => line.trim().startsWith('•') || line.trim().startsWith('-'))
            .map(line => `<li>${line.replace(/^[•\-]\s*/, '').trim()}</li>`)
            .join('');
          
          const otherText = lines
            .filter(line => !line.trim().startsWith('•') && !line.trim().startsWith('-'))
            .join(' ').trim();
          
          return otherText ? `<p>${otherText}</p><ul>${listItems}</ul>` : `<ul>${listItems}</ul>`;
        }
        
        // Regular paragraphs
        return `<p>${paragraph.trim()}</p>`;
      })
      .join('');
      return this.sanitizer.bypassSecurityTrustHtml(html) as string;
  }

  protected getCurrentDate(): string {
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

}
