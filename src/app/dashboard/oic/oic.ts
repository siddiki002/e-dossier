import { Component } from '@angular/core';
import { OfficersTable } from 'src/common/components/officers-table/officers-table';
import { Officer } from 'src/common/common.types';
import { officers } from 'src/static/data';

@Component({
  selector: 'oic',
  imports: [OfficersTable],
  templateUrl: './oic.html',
  styleUrl: './oic.css'
})
export class Oic {

  protected displayedColumns: string[] = ['id', 'name', 'fatherName', 'cnic'];
  protected dataSource: Officer[] = [];
  
  constructor() {
    // In real application this data would come from a backend service
    this.dataSource = [...officers];
  }

}
