import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core'
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { baseUrl } from 'src/common/base';
import { Class, ExtraCurricular, Officer, Sport } from 'src/common/common.types';
import { SailorListComponent } from 'src/common/components/sailor-list/sailor-list.component';
import { forkJoin, isEmpty, Observable } from 'rxjs';

type officerPetDetails = {
  sports: Sport[],
  extraCurricular: ExtraCurricular[]
}

type ApiCalls = {
  [key: string]: Observable<any>
}

@Component({
  selector: 'pet-sports',
  imports: [SailorListComponent, ReactiveFormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './pet-sports.html',
  styleUrl: './pet-sports.css'
})
export class PetSports {

  protected classId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected classDetails: Class | null = null;
  protected selectedOfficer: Officer | null = null;
  protected events : Array<string> = ['Mile', 'Push Ups'];

  protected petForm: FormGroup = new FormGroup({
    petEvents: new FormArray([]),
    sports: new FormArray([]),
    extraCurricular: new FormArray([])
  });

  // Getter methods for form arrays
  get petEventsArray(): FormArray {
    return this.petForm.get('petEvents') as FormArray;
  }

  get sportsArray(): FormArray {
    return this.petForm.get('sports') as FormArray;
  }

  get extraCurricularArray(): FormArray {
    return this.petForm.get('extraCurricular') as FormArray;
  }

  constructor(private router: Router, private activatedRouter: ActivatedRoute, private http: HttpClient, private dialog: MatDialog) {
    this.sailorsInClass = this.router?.currentNavigation()?.extras?.state?.['data'] || [];
    this.activatedRouter?.params?.subscribe((params) => {
      this.classId = params['classId'];
    })
  }

  ngOnInit() {
    this.fetchClassDetails();
    // Initialize with empty sports and extracurricular rows
    this.addNewRow('sports');
    this.addNewRow('extraCurricular');
  }

  private fetchClassDetails() {
    this.http.get<Class>(`${baseUrl}/class/${this.classId}`).subscribe((data) => {
      this.classDetails = data;
    })
  }

  private fetchOfficerPetDetails(officerId: string) {
    this.http.get<officerPetDetails>(`${baseUrl}/data-entry/officer/${officerId}/pet`).subscribe((data) => {
      this.populateFormWithPetData(data);
    })
  }

  private populateFormWithPetData(data: officerPetDetails) {
    // Populate the form with the fetched pet data
    this.petEventsArray.clear();
    this.sportsArray.clear();
    this.extraCurricularArray.clear();

    // Populate PET events from selectedOfficer.pet
    if (this.selectedOfficer?.pet) {
      this.selectedOfficer.pet.forEach(petEvent => {
        const petEventFormGroup = this.createPetEventFormGroup(petEvent);
        this.petEventsArray.push(petEventFormGroup);
      });
    }

    // Add default events if none exist
    if (this.petEventsArray.length === 0) {
      this.events.forEach(event => {
        const petEventFormGroup = this.createPetEventFormGroup({
          event: event,
          totalMarks: 0,
          obtainedMarks: 0,
          remarks: ''
        });
        this.petEventsArray.push(petEventFormGroup);
      });
    }

    data?.sports?.forEach(sport => {
      const sportsFormGroup = this.createSportsObservationFormGroup(sport);
      this.sportsArray.push(sportsFormGroup);
    });

    data?.extraCurricular?.forEach(activity => {
      const activityFormGroup = this.createExtraCurricularFormGroup(activity);
      this.extraCurricularArray.push(activityFormGroup);
    });

    // Add empty rows if no data exists
    if (this.sportsArray.length === 0) {
      this.addNewRow('sports');
    }
    if (this.extraCurricularArray.length === 0) {
      this.addNewRow('extraCurricular');
    }
  }

  private createPetEventFormGroup(petEvent: any): FormGroup {
    return new FormGroup({
      event: new FormControl(petEvent.event || '', Validators.required),
      totalMarks: new FormControl(petEvent.totalMarks || 0, Validators.required),
      obtainedMarks: new FormControl(petEvent.obtainedMarks || 0, Validators.required),
      remarks: new FormControl(petEvent.remarks || '')
    });
  }

  private createSportsObservationFormGroup(sport?: Sport): FormGroup {
    return new FormGroup({
      game: new FormControl(sport?.game || '', Validators.required),
      performance: new FormControl(sport?.performance || '', Validators.required),
      remarks: new FormControl(sport?.remarks || '')
    });
  }

  private createExtraCurricularFormGroup(activity?: ExtraCurricular): FormGroup {
    return new FormGroup({
      activity: new FormControl(activity?.activity || '', Validators.required),
      performance: new FormControl(activity?.performance || '', Validators.required),
      event: new FormControl(activity?.event || '', Validators.required)
    });
  }

  protected onOfficerSelection(selectedOfficer: Officer) {
    this.selectedOfficer = selectedOfficer;
    this.fetchOfficerPetDetails(selectedOfficer.id);
  }

  protected savePetRecord() {
    if (!this.selectedOfficer) {
      console.log('No officer selected');
      return;
    }

    const formData = {
      officerId: this.selectedOfficer.id,
      petEvents: this.petEventsArray.value,
      sports: this.sportsArray.value,
      extraCurricular: this.extraCurricularArray.value
    };

    console.log('Saving PET record:', formData);

    // update the record for officer
    const calls : ApiCalls = {
      updateOfficerPet: this.http.put(`${baseUrl}/data-entry/officer/${this.selectedOfficer.id}`, {
        pet : formData.petEvents
      }),
    }

    const payload = {
      extraCurricular : [],
      sports : []
    }

    if(this.sportsArray.length > 0 && !this.isEmptyArray(this.sportsArray.value)) {
      payload.sports = this.sportsArray.value;
    }

    if(this.extraCurricularArray.length > 0 && !this.isEmptyArray(this.extraCurricularArray.value)) {
      payload.extraCurricular = this.extraCurricularArray.value;
    }

    if(payload.extraCurricular.length || payload.sports.length) {
      calls['updateOfficerPetDetails'] = this.http.post(`${baseUrl}/data-entry/officer/${this.selectedOfficer.id}/pet`, payload);
    }

    forkJoin(calls).subscribe({
      next: (responses) => {
        this.fetchOfficerInClass(this.classId);
        console.log('PET record saved successfully', responses);
      }
    });
  }

  private isEmptyArray(arr: any[]): boolean {
    return arr.every(item => {
      return Object.values(item).every(value => value === null || value === '' || value === 0);
    });
  }

  private fetchOfficerInClass(classId: string) {
    this.http.get<Officer[]>(`${baseUrl}/class/${classId}/officers`).subscribe((data) => {
      this.sailorsInClass = data;
    });
  }

  protected addNewRow(type: 'sports' | 'extraCurricular') {
    if (type === 'sports') {
      this.sportsArray.push(this.createSportsObservationFormGroup());
    } else if (type === 'extraCurricular') {
      this.extraCurricularArray.push(this.createExtraCurricularFormGroup());
    }
  }

  protected removeRow(type: 'sports' | 'extraCurricular', index: number) {
    if (type === 'sports' && this.sportsArray.length > 1) {
      this.sportsArray.removeAt(index);
    } else if (type === 'extraCurricular' && this.extraCurricularArray.length > 1) {
      this.extraCurricularArray.removeAt(index);
    }
  }
}
