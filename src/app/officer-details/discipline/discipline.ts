import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Officer, Warnings } from 'src/common/common.types';

@Component({
  selector: 'discipline',
  imports: [CommonModule, FormsModule],
  templateUrl: './discipline.html',
  styleUrl: './discipline.css'
})
export class Discipline implements OnInit {

  protected officerId: string = '';
  protected officerDetails: Officer | null = null;
  protected warningRecords: Warnings[] = [];

  constructor(private http: HttpClient, private activatedRoute: ActivatedRoute) {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.officerId = params['id'];
    })
  }

  ngOnInit() {
    this.fetchOfficerDetails();
    this.fetchWarningRecords();
  }

  private fetchOfficerDetails() {
    this.http.get<Officer>(`${baseUrl}/data-entry/officer/${this.officerId}`).subscribe((data) => {
      this.officerDetails = data;
    });
  }

  private fetchWarningRecords() {
    this.http.get<Warnings[]>(`${baseUrl}/data-entry/officer/${this.officerId}/warnings`).subscribe((data) => {
      console.log(data);
      this.warningRecords = data;
    });
  }

  protected get observations() : Warnings[] {
    return this.warningRecords.filter(record => record.type === 'observations');
  }

  protected get punishment() : Warnings[] {
    return this.warningRecords.filter(record => record.type === 'punishment');
  }

  protected get warningSlips() : Warnings[] {
    return this.warningRecords.filter(record => record.type === 'warningSlips');
  }

}
