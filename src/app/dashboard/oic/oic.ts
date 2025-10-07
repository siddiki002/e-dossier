import { Component } from '@angular/core';
import { OfficersTable } from 'src/common/components/officers-table/officers-table';
import { Class, Officer } from 'src/common/common.types';
import { classes, officers } from 'src/static/data';
import {MatTabsModule} from '@angular/material/tabs';
import { DemoBarChart } from "./demo-line-chart/demo-bar-chart";
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'oic',
  imports: [CommonModule, FormsModule, OfficersTable, MatTabsModule, DemoBarChart, MatSelectModule, MatFormFieldModule],
  templateUrl: './oic.html',
  styleUrl: './oic.css'
})
export class Oic {

  protected displayedColumns: string[] = ['id', 'name', 'fatherName', 'cnic'];
  protected dataSource: Officer[] = [];
  protected classAvgChartData = {
        labels: ['2021 Alpha', '2021 Beta', '2022 Alpha','2022 Beta',
                 '2023 Alpha', '2023 Beta', '2024 Alpha','2024 Beta'], 
        datasets: [
          {
            label: "Academics (Avg)",
            data: [467, 576, 572, 435, 492, 574, 573, 576],
            backgroundColor: 'blue',
            borderColor: 'blue',
            // fill: false
          },
        ]
      };
  
  protected classAvgSportsChartData = {
        labels: ['2021 Alpha', '2021 Beta', '2022 Alpha','2022 Beta',
                 '2023 Alpha', '2023 Beta', '2024 Alpha','2024 Beta'], 
        datasets: [
          {
            label: "Sports (Avg)",
            data: [542, 542, 536, 327, 310, 400, 538, 541],
            backgroundColor: 'green',
            borderColor: 'green',
            // fill: false
          },
        ]
  };
  protected classes: Class[] = []
  protected selectedClasses: string[] = []

  protected onClassSelection(selectedClasses: string[]) {
    this.selectedClasses = [...selectedClasses];
    if (this.selectedClasses.length > 0) {
      this.dataSource = officers.filter((officer) => {
        return this.selectedClasses.some(classId => officer.classId.includes(classId));
      });
    } else {
      this.dataSource = [...officers];
    }
  }

  constructor() {
    // In real application this data would come from a backend service
    this.dataSource = [...officers];
    this.classes = [...classes]
  }

}
