import { Component } from '@angular/core';
import { Officer } from 'src/common/common.types';
import { classes, officers } from 'src/static/data';
import { OfficersTable } from 'src/common/components/officers-table/officers-table';

@Component({
  selector: 'instructor',
  imports: [OfficersTable],
  templateUrl: './instructor.html',
  styleUrl: './instructor.css'
})
export class Instructor {
protected displayedColumns: string[] = ['id', 'name', 'fatherName', 'cnic'];
  protected dataSource: Officer[] = [];

  private _instructorId: string = 'INS1001'; // Hardcoded for demonstration, in real application this would come from authentication context
  
  constructor() {
    // In real application this data would come from a backend service
    const classOfInstructor = classes.find(cls => cls.instructorId === this._instructorId);
    if(classOfInstructor){
      this.dataSource = officers.filter(officer => officer.classId.includes(classOfInstructor.id));
    }
  }
}
