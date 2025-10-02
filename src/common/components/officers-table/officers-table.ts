import { Component, Input } from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { Router } from '@angular/router';
import { Officer } from 'src/common/common.types';
@Component({
  selector: 'officers-table',
  imports: [MatTableModule],
  templateUrl: './officers-table.html',
  styleUrl: './officers-table.css'
})
export class OfficersTable {
  @Input() dataSource: Officer[] = [];

  constructor(private router: Router) {}

  protected displayedColumns: string[] = ['id', 'name', 'fatherName', 'cnic'];

  navigateToOfficerDetails(officerId: string) {
    this.router.navigate(['/officer-details', officerId]);
  }
}
