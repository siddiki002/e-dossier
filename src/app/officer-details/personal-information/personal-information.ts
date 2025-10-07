import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Officer } from 'src/common/common.types';
import { classes, officers } from 'src/static/data';
import { OfficerCard } from "src/common/components/officer-card/officer-card";
import { MatTableModule } from "@angular/material/table";

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
  imports: [CommonModule, OfficerCard, MatTableModule],
  templateUrl: './personal-information.html',
  styleUrl: './personal-information.css'
})
export class PersonalInformation {

  protected officerDetails! : Officer
  protected familyParticularsDisplayedColumns: string[] = ['relation', 'name', 'occupation', 'contactNumber', 'address', 'age'];
  protected familyParticularsDataSource: familyParticular[] = [
    {
      relation: 'Father',
      name: this.officerDetails?.fatherName,
      occupation: 'Retired',
      contactNumber: '123-456-7890',
      address: '123 Main St, City, Country',
      age: 70
    }, 
    {
      relation: 'Mother',
      name: 'Salma Raza',
      occupation: 'Homemaker',
      contactNumber: '098-765-4321',
      address: '123 Main St, City, Country',
      age: 68
    }, 
    {
      relation: 'Spouse',
      name: 'Mehreen Raza',
      occupation: 'Teacher',
      contactNumber: '555-555-5555',
      address: '123 Main St, City, Country',
      age: 35
    }
  ]
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

  public get className(): string {
    const classInfo = classes.find(c => this.officerDetails.classId.includes(c.id));
    return classInfo ? classInfo.name : 'Unknown';
  }
}
