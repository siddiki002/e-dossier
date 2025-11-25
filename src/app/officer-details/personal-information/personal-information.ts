import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Officer } from 'src/common/common.types';
import { MatTableModule } from "@angular/material/table";
import { HttpClient } from '@angular/common/http';
import { baseUrl } from 'src/common/base';

type familyParticular = {
  relation: string,
  name: string,
  occupation: string,
  contactNumber: string,
  address: string,
  age: number
}

@Component({
  selector: 'personal-information',
  imports: [CommonModule, MatTableModule],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.css'
})
export class PersonalInformation {

  protected officer : Officer | null = null;
  protected officerId : string = '';
  constructor(private activatedRoute: ActivatedRoute, private http: HttpClient) {
    this.activatedRoute.parent?.params.subscribe((params) => {
      this.officerId = params['id'];
    })
  }

  ngOnInit() {
    this.fetchOfficerDetails();
  }

  private fetchOfficerDetails() {
    this.http.get<Officer>(`${baseUrl}/data-entry/officer/${this.officerId}`).subscribe((data) => {
      this.officer = data;
      console.log(data);
    })

  }
}
