import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Class, Officer, Pet, Warnings } from 'src/common/common.types';
import {MatTabsModule} from '@angular/material/tabs';
import { DemoBarChart } from "./demo-line-chart/demo-bar-chart";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/common/base';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { marked } from 'marked';

type averageMarksByClass = {
  classId: string,
  className: string,
  averageMarks: number
}

type averagePetMarksByClass = {
  classId: string,
  className: string,
  officerId: string,
  petMarks: Pet[]
}

type classAverageChartData = {
  labels: string[],
  datasets: {
    label: string,
    data: number[],
    backgroundColor: string,
    borderColor: string,
  }[]
}

type WarningCount = {
  warningCounts: number,
  punishments: number,
  observations: number
};

@Component({
  selector: 'oic',
  imports: [CommonModule, FormsModule, MatTabsModule, DemoBarChart, MatSelectModule, MatFormFieldModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './oic.html',
  styleUrl: './oic.css'
})
export class Oic implements OnInit {

  protected dataSource: Officer[] = [];
  protected classAvgChartData: classAverageChartData = {
    labels: [],
    datasets: [
      {
        label: "Academics (Avg)",
        data: [],
        backgroundColor: 'blue',
        borderColor: 'blue',
      },
    ]
  };

  protected classAvgSportsChartData : classAverageChartData = {
        labels: [],
        datasets: [
          {
            label: "Sports (Avg)",
            data: [],
            backgroundColor: 'green',
            borderColor: 'green',
          },
        ]
  };
  protected classes: Class[] = [];
  protected selectedClasses: string[] = [];
  protected selectedClass: string = '';
  protected selectedTabIndex: number = 0;
  protected searchQuery: string = '';
  protected filteredOfficers: Officer[] = []
  protected allOfficers: Officer[] = []
  protected isLoading: boolean = false
  protected averageMarksByClass: averageMarksByClass[] = []
  protected averagePetMarksByClass: averagePetMarksByClass[] = []
  protected warnings : WarningCount = {
    warningCounts: 0,
    punishments: 0,
    observations: 0
  }
  
  // Dashboard data properties
  protected disciplineRecords: Warnings[] = []
  protected medicalRecords: any[] = []
  
  // AI Report properties
  protected showAiReport: boolean = false
  protected showAiReportContainer: boolean = false
  protected isLoadingAiReport: boolean = false
  protected displayedSummary: string = ''
  protected isTypingAnimation: boolean = false;
  protected summaryHtml: SafeHtml = '';

  protected onClassSelection(selectedClasses: string[]) {
    this.selectedClasses = [...selectedClasses];
    this.isLoading = true;
    if (this.selectedClasses.length > 0) {
      this.fetchOfficersByClasses();
    } else {
      this.fetchOfficers();
    }
  }

  protected onSearch(query: string) {
    this.searchQuery = query;
    this.applySearchFilter();
  }

  private applySearchFilter() {
    let filtered = [...this.allOfficers];

    // Filter by search query
    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase().trim();
      filtered = filtered.filter((officer) => 
        officer.name.toLowerCase().includes(query) ||
        officer.officerId.toLowerCase().includes(query)
      );
    }

    this.filteredOfficers = filtered;
    this.dataSource = filtered;
  }

  private fetchOfficersByClasses() {
    const officerPromises = this.selectedClasses.map(classId => 
      this.http.get<Officer[]>(`${baseUrl}/class/${classId}/officers`).toPromise()
    );

    Promise.all(officerPromises).then((results) => {
      const allClassOfficers = results.flat().filter(Boolean) as Officer[];
      
      const officerMap = new Map();
      allClassOfficers.forEach(officer => {
        if (!officerMap.has(officer.id)) {
          officerMap.set(officer.id, officer);
        }
      });
      const uniqueOfficers = Array.from(officerMap.values());
      
      this.allOfficers = uniqueOfficers;
      this.applySearchFilter();
      this.isLoading = false;
    }).catch((error) => {
      console.error('Error fetching officers by classes:', error);
      this.allOfficers = [];
      this.filteredOfficers = [];
      this.dataSource = [];
      this.isLoading = false;
    });
  }

  protected viewOfficerDetails(officerId: string) {
    this.router.navigate(['officer-details', officerId]);
  }

  constructor(private http: HttpClient, private router: Router, private sanitizer: DomSanitizer, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.fetchOfficers();
    this.fetchClasses();
    this.fetchAverageMarks();
    this.fetchAveragePetMarks();
    this.fetchWarningCount();
  }

  ngOnDestroy() {
    if(this.classes.length) {
      this.classes.forEach((cls) => {
        localStorage.removeItem(`oic-ai-summary-${cls.id}`);
      })
    }
  }

  private fetchWarningCount() {
    this.http.get<WarningCount>(`${baseUrl}/officers/warnings`).subscribe((data) => {
      this.warnings = data;
    })
  }

  private fetchOfficers() {
    this.isLoading = true;
    this.http.get<Officer[]>(`${baseUrl}/data-entry/officer`).subscribe({
      next: (data) => {
        console.log("Fetched officers:", data);
        this.allOfficers = data;
        this.applySearchFilter();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching officers:', error);
        this.allOfficers = [];
        this.filteredOfficers = [];
        this.dataSource = [];
        this.isLoading = false;
      }
    });
  }

  private fetchClasses() {
    this.http.get<Class[]>(`${baseUrl}/classes`).subscribe({
      next: (data) => {
        this.classes = data;
      },
      error: (error) => {
        console.error('Error fetching classes:', error);
        this.classes = [];
      }
    });
  }

  private fetchAverageMarks() {
    this.http.get<averageMarksByClass[]>(`${baseUrl}/classes/average`).subscribe((data) => {
      this.averageMarksByClass = data;
      this.populateAverageMarksInGraph();
    })
  }

  private fetchAveragePetMarks() {
    this.http.get<averagePetMarksByClass[]>(`${baseUrl}/classes/pet`).subscribe((data) => {
      this.averagePetMarksByClass = data;
      this.populateAveragePetMarksInGraph();
    })
  }

  private populateAverageMarksInGraph(){
    const classNames = this.averageMarksByClass.map((item) => item.className);
    const marksForEachClass = this.averageMarksByClass.map((item) => item.averageMarks);

    this.classAvgChartData.labels = classNames;
    this.classAvgChartData.datasets[0].data = marksForEachClass;
  }

  private populateAveragePetMarksInGraph(){
    const classNames = this.averagePetMarksByClass.map((item) => item.className);
    // remove repeated names
    const uniqueClassNames = Array.from(new Set(classNames));
    // group by classId to calculate average pet marks
    const petAverages: { [key: string]: number } = {};
    this.averagePetMarksByClass.forEach((item) => {
      if(item.className in petAverages) {
        petAverages[item.className] += this.calculateAvgPetMarks(item.petMarks);
      } else {
        petAverages[item.className] = this.calculateAvgPetMarks(item.petMarks);
      }
    });

    this.classAvgSportsChartData.labels = uniqueClassNames;
    this.classAvgSportsChartData.datasets[0].data = Object.values(petAverages);
  }

  private calculateAvgPetMarks(petMarks: Pet[]): number {
    if(!petMarks || petMarks.length === 0) return 0;

    let obtainedMarks = 0;

    petMarks.forEach((pet) => {
      obtainedMarks += pet.obtainedMarks;
    });

    return Number((obtainedMarks / petMarks.length).toFixed(2));
  }

  // Dashboard helper methods
  protected getDisciplineCount(type: "punishments" | "warningCounts" | "observations"): number {
    return this.warnings[type];
  }

  protected getTotalDisciplineCount(): number {
    return this.warnings.punishments + this.warnings.warningCounts + this.warnings.observations;
  }

  protected getTotalOfficersCount(): number {
    return this.allOfficers.length;
  }

  protected getCurrentTime(): string {
    return new Date().toLocaleTimeString();
  }

  protected async generateAiReport(): Promise<void> {
    this.showAiReport = true;
    this.isLoadingAiReport = true;
    this.summaryHtml = '';

    const cachedSummary = this.getCachedSummary();
    if (cachedSummary) {
      this.summaryHtml = await this.convertSummaryFromMarkdown(cachedSummary);
      this.isLoadingAiReport = false;
      this.cdr.detectChanges();
      return;
    }

    this.http.get<{aiSummary: string}>(`${baseUrl}/class/${this.selectedClass}/ai-summary`).subscribe({
      next: async (data) => {
        this.cacheSummary(data.aiSummary);
        this.summaryHtml = await this.convertSummaryFromMarkdown(data.aiSummary);
        this.isLoadingAiReport = false;
        this.cdr.detectChanges();
      },
      error: async (error) => {
        console.error('Error fetching AI summary:', error);
        this.summaryHtml = await this.convertSummaryFromMarkdown('Failed to generate AI report. Please try again.');
        this.isLoadingAiReport = false;
        this.cdr.detectChanges();
      }
    });
  }

  protected onAIReportClassSelection(classId: string): void {
    this.selectedClass = classId;
    this.generateAiReport();
  }

  protected onShowAiReportCard(): void {
    this.showAiReportContainer = true;
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }

  protected closeAiReport(): void {
    this.showAiReport = false;
    this.displayedSummary = '';
    this.isTypingAnimation = false;
    this.isLoadingAiReport = false;
  }

  private async convertSummaryFromMarkdown(summary: string): Promise<SafeHtml> {
    const markdown = await marked(summary);
    return this.sanitizer.bypassSecurityTrustHtml(markdown);
  }

  private cacheSummary(summary: string): void {
    localStorage.setItem(`oic-ai-summary-${this.selectedClass}`, summary);
  }

  private getCachedSummary(): string | null {
    return localStorage.getItem(`oic-ai-summary-${this.selectedClass}`);
  }
}
