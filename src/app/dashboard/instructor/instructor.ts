import { Component, OnInit } from '@angular/core';
import { Class, Officer, Pet, Warnings } from 'src/common/common.types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTabsModule } from '@angular/material/tabs';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { baseUrl } from 'src/common/base';

@Component({
  selector: 'instructor',
  imports: [CommonModule, FormsModule, MatTabsModule, MatSelectModule, MatFormFieldModule, MatCardModule, MatChipsModule, MatIconModule, MatButtonModule, MatInputModule, MatProgressSpinnerModule, MatDividerModule],
  templateUrl: './instructor.html',
  styleUrl: './instructor.css'
})
export class Instructor implements OnInit {
  protected displayedColumns: string[] = ['id', 'name', 'fatherName', 'cnic'];
  protected dataSource: Officer[] = [];
  protected classes: Class[] = []
  protected selectedClasses: string[] = []
  protected searchQuery: string = ''
  protected filteredOfficers: Officer[] = []
  protected allOfficers: Officer[] = []
  protected isLoading: boolean = false

  private _instructorId: string = 'INS1001'; // Hardcoded for demonstration

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.fetchOfficers();
    this.fetchClasses();
  }

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
        officer.officerId.toLowerCase().includes(query) ||
        (officer.rate && officer.rate.toLowerCase().includes(query)) ||
        (officer.cnic && officer.cnic.toLowerCase().includes(query))
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
      // Flatten and deduplicate officers from multiple classes
      const allClassOfficers = results.flat().filter(Boolean) as Officer[];
      const uniqueOfficers = allClassOfficers.filter((officer, index, self) => 
        index === self.findIndex(o => o.id === officer.id)
      );
      
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
}
