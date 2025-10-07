import { CommonModule } from '@angular/common';
import { Component, Input, SimpleChange } from '@angular/core';
import { Officer } from 'src/common/common.types';
import { classes } from 'src/static/data';

@Component({
  selector: 'officer-card',
  imports: [CommonModule],
  templateUrl: './officer-card.html',
  styleUrl: './officer-card.css'
})
export class OfficerCard {
  @Input() officerDetails!: Officer;

  public get className() : string {
    if(!this.officerDetails || !this.officerDetails.classId) {
      return 'Unknown';
    }
    return classes.find(c => this.officerDetails.classId.includes(c.id))?.name || 'Unknown';
  }
}
