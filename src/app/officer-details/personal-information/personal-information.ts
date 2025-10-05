import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Officer } from 'src/common/common.types';
import { officers } from 'src/static/data';

@Component({
  selector: 'personal-information',
  imports: [CommonModule],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.css'
})
export class PersonalInformation {

  protected officerDetails! : Officer 
  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((params) => {
      const officerId = params['id'];

      const currentOfficer = officers.find(o => o.id === officerId)
      if(currentOfficer) {
        this.officerDetails = currentOfficer;
      }
    })
  }
}
