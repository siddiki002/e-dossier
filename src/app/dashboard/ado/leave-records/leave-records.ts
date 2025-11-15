import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Class, Officer } from 'src/common/common.types';
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";

@Component({
  selector: 'leave-records',
  imports: [SailorListComponent],
  templateUrl: './leave-records.html',
  styleUrl: './leave-records.css'
})
export class LeaveRecords {
  protected classId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected classDetails: Class | null = null;

  constructor(private router: Router, private activatedRouter: ActivatedRoute, private http: HttpClient, private dialog: MatDialog) {
    this.sailorsInClass = this.router?.currentNavigation()?.extras?.state?.['data'] || [];
    this.activatedRouter?.params?.subscribe((params) => {
      this.classId = params['classId'];
    })
  }

  ngOnInit() {
      this.fetchClassDetails();
    }
  
    private fetchClassDetails() {
      this.http.get<Class>(`${baseUrl}/class/${this.classId}`).subscribe((data) => {
        this.classDetails = data;
      })
    }
  
    protected onOfficerSelection(selectedOfficer: Officer) {}

}
