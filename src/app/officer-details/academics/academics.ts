import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Officer } from 'src/common/common.types';
import { officers } from 'src/static/data';
import { OfficerCard } from "src/common/components/officer-card/officer-card";
import { MatTableModule } from '@angular/material/table';

type compulsoryModules = {
  name: string,
  passedFirstAttempt: boolean,
  passedSecondAttempt?: boolean,
  passedThirdAttempt?: boolean
}

type pttAssessment = {
  Subject: string,
  Total: number,
  [assessmentType.quiz]: number,
  [assessmentType.assignment]: number,
  [assessmentType.formativeTest]: number,
  [assessmentType.finals]: number
}

enum assessmentType {
  quiz = 'quiz',
  assignment = 'assignment',
  formativeTest = 'formativeTest',
  finals = 'finals'
}

@Component({
  selector: 'academics',
  imports: [OfficerCard, MatTableModule],
  templateUrl: './academics.html',
  styleUrl: './academics.css'
})
export class Academics {
  protected officerDetails! : Officer 
  constructor(private activatedRoute: ActivatedRoute) {}

  protected compulsoryModuleDisplayedColumns: string[] = ['name', 'firstAttempt', 'secondAttempt', 'thirdAttempt'];
  protected pttAssessmentDisplayedColumns: string[] = ['subject', 'total', 'quiz', 'assignment', 'formativeTest', 'finals', 'grade'];
  protected weightage = {
    [assessmentType.quiz]: 0.2,
    [assessmentType.assignment]: 0.1,
    [assessmentType.formativeTest]: 0.2,
    [assessmentType.finals]: 0.5
  }

  protected compulsoryModuleDataSource: compulsoryModules[] = [
    {
      name: 'SST',
      passedFirstAttempt: false
    },
    {
      name: 'SSC',
      passedFirstAttempt: true
    },
    {
      name: 'S & WT',
      passedFirstAttempt: false
    }
  ]
  protected pttAssessmentDataSource : pttAssessment[] = [
    {Subject: 'English', Total: 85, [assessmentType.quiz]: 20, [assessmentType.assignment]: 15, [assessmentType.formativeTest]: 20, [assessmentType.finals]: 30
    },
    {Subject: 'Urdu', Total: 75, [assessmentType.quiz]: 15, [assessmentType.assignment]: 15, [assessmentType.formativeTest]: 15, [assessmentType.finals]: 30
    },
    {Subject: 'Islamic Studies', Total: 95, [assessmentType.quiz]: 25, [assessmentType.assignment]: 20, [assessmentType.formativeTest]: 20, [assessmentType.finals]: 30
    },
    {Subject: 'Pakistan Studies', Total: 65, [assessmentType.quiz]: 10, [assessmentType.assignment]: 15, [assessmentType.formativeTest]: 10, [assessmentType.finals]: 30
    },
    {Subject: 'Maths', Total: 80, [assessmentType.quiz]: 20, [assessmentType.assignment]: 15, [assessmentType.formativeTest]: 15, [assessmentType.finals]: 30
    },
    {Subject: 'Physics', Total: 70, [assessmentType.quiz]: 15, [assessmentType.assignment]: 15, [assessmentType.formativeTest]: 10, [assessmentType.finals]: 30
    },
  ];

  ngOnInit() {
    this.activatedRoute.parent?.params.subscribe((params) => {
      const officerId = params['id'];

      const currentOfficer = officers.find(o => o.id === officerId)
      if(currentOfficer) {
        this.officerDetails = currentOfficer;
      }
    })

    console.log(this.pttAssessmentDataSource);
  }

  protected calculateGrade(pttAssessment: pttAssessment): string {
    if (pttAssessment.Total >= 85) {
      return 'A';
    } else if (pttAssessment.Total >= 70) {
      return 'B';
    } else if (pttAssessment.Total >= 50) {
      return 'C';
    } else {
      return 'F';
    }
  }
}
