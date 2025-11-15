import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { baseUrl } from 'src/common/base';
import { Class, Officer, Warnings } from 'src/common/common.types';
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";

@Component({
  selector: 'discipline-observation',
  imports: [SailorListComponent, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatIconModule],
  templateUrl: './discipline-observation.html',
  styleUrl: './discipline-observation.css'
})
export class DisciplineObservation {

  protected classId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected classDetails: Class | null = null;
  protected selectedOfficerObservations: Warnings[] = [];
  protected selectedOfficer: Officer | null = null;

  protected disciplineForm: FormGroup = new FormGroup({
    punishments: new FormArray([]),
    warningSlips: new FormArray([]),
    observations: new FormArray([])
  });

  constructor(private router: Router, private activatedRouter: ActivatedRoute, private http: HttpClient, private dialog: MatDialog) {
    this.sailorsInClass = this.router?.currentNavigation()?.extras?.state?.['data'] || [];
    this.activatedRouter?.params?.subscribe((params) => {
      this.classId = params['classId'];
    })
  }

  ngOnInit() {
    this.fetchClassDetails();
    // this.fetchOfficerDisciplineObservations();
  }

  private fetchClassDetails() {
    this.http.get<Class>(`${baseUrl}/class/${this.classId}`).subscribe((data) => {
      this.classDetails = data;
    })
  }

  private fetchOfficerDisciplineObservations(officerId: string) {
    this.http.get<Warnings[]>(`${baseUrl}/data-entry/officer/${officerId}/warnings`).subscribe((data) => {
      this.selectedOfficerObservations = data;
      this.populateFormWithObservations(data);
    })
  }

  private populateFormWithObservations(observations: Warnings[]) {
    // Clear existing form arrays
    this.punishmentsArray.clear();
    this.warningSlipsArray.clear();
    this.observationsArray.clear();

    // Populate form arrays with existing data
    observations.forEach(obs => {
      const formGroup = this.createObservationFormGroup(obs);
      switch (obs.type) {
        case 'punishment':
          this.punishmentsArray.push(formGroup);
          break;
        case 'warningSlips':
          this.warningSlipsArray.push(formGroup);
          break;
        case 'observations':
          this.observationsArray.push(formGroup);
          break;
      }
    });

    // Add empty rows if no data exists
    if (this.punishmentsArray.length === 0) {
      this.addNewRow('punishment');
    }
    if (this.warningSlipsArray.length === 0) {
      this.addNewRow('warningSlips');
    }
    if (this.observationsArray.length === 0) {
      this.addNewRow('observations');
    }
  }

  private createObservationFormGroup(obs?: Warnings): FormGroup {
    return new FormGroup({
      id: new FormControl(obs?.id || ''),
      date: new FormControl(obs?.date || '', Validators.required),
      offense: new FormControl(obs?.offense || '', Validators.required),
      punishment: new FormControl(obs?.punishment || '', Validators.required),
      awardedBy: new FormControl(obs?.awardedBy || '', Validators.required)
    });
  }

  protected onOfficerSelection(selectedOfficer: Officer) {
    this.selectedOfficer = selectedOfficer;
    this.fetchOfficerDisciplineObservations(selectedOfficer.id);
  }

  protected getObservationByType(type: 'punishment' | 'warningSlips' | 'observations') {
    return this.selectedOfficerObservations.filter(obs => obs.type === type);
  }

  protected get punishmentsArray() {
    return this.disciplineForm.get('punishments') as FormArray;
  }

  protected get warningSlipsArray() {
    return this.disciplineForm.get('warningSlips') as FormArray;
  }

  protected get observationsArray() {
    return this.disciplineForm.get('observations') as FormArray;
  }

  protected addNewRow(type: 'punishment' | 'warningSlips' | 'observations') {
    const newRow = this.createObservationFormGroup();
    switch (type) {
      case 'punishment':
        this.punishmentsArray.push(newRow);
        break;
      case 'warningSlips':
        this.warningSlipsArray.push(newRow);
        break;
      case 'observations':
        this.observationsArray.push(newRow);
        break;
    }
  }

  protected removeRow(type: 'punishment' | 'warningSlips' | 'observations', index: number) {
    switch (type) {
      case 'punishment':
        this.removeWarning(this.punishmentsArray, index);
        break;
      case 'warningSlips':
        this.removeWarning(this.warningSlipsArray, index);
        break;
      case 'observations':
        this.removeWarning(this.observationsArray, index);
        break;
    }
  }

  protected onSave() {
    if (!this.selectedOfficer) {
      console.log('No officer selected');
      alert('Please select an officer first');
      return;
    }

    const formValue = this.disciplineForm.value;
    const {observations, punishments, warningSlips} = formValue;

    let hasDataToSave = false;

    if(!this.isEmptyArray(observations)){
      this.saveWarnings(observations, 'observations');
      hasDataToSave = true;
    }
    if(!this.isEmptyArray(punishments)){
      this.saveWarnings(punishments, 'punishment');
      hasDataToSave = true;
    }
    if(!this.isEmptyArray(warningSlips)){
      this.saveWarnings(warningSlips, 'warningSlips');
      hasDataToSave = true;
    }

    if (!hasDataToSave) {
      alert('No data to save. Please fill in at least one field.');
    }
  }

  private isEmptyArray(arr : Warnings[]) : boolean {
    if(arr.length === 0) return true;
    for(const item of arr) {
      // Check if any of the required fields have meaningful values
      if((item.date && item.date.toString().trim()) || 
         (item.offense && item.offense.trim()) || 
         (item.punishment && item.punishment.trim()) || 
         (item.awardedBy && item.awardedBy.trim())) {
        return false;
      }
    }
    return true;
  }

  private saveWarnings(warnings: Warnings[], type: 'punishment' | 'warningSlips' | 'observations') {
    // Filter out entries that already have an ID (already saved)
    const newWarnings = warnings.filter(warning => !warning.id);
    
    // If no new warnings to save, return early
    if (newWarnings.length === 0) {
      console.log(`No new ${type} entries to save`);
      return;
    }

    const payload = newWarnings.map(warning => ({
      date: warning.date,
      offense: warning.offense,
      punishment: warning.punishment,
      awardedBy: warning.awardedBy,
      type: type,
      officerId: this.selectedOfficer?.id
    }));

    console.log(payload);

    this.http.post(`${baseUrl}/data-entry/officer/${this.selectedOfficer?.id}/warnings`, payload).subscribe((response: any) => {
      alert(`${type} saved successfully`);
      this.fetchOfficerDisciplineObservations(this.selectedOfficer!.id);
    });
  }

  private removeWarning(formArray: FormArray, index: number) {
    const element = formArray.at(index);
    console.log(formArray, index, element);
    if(element.value.id) {
      // If the entry has an ID, delete it from the backend first
      this.http.delete(`${baseUrl}/data-entry/warning/${element.value.id}`).subscribe(() => {
        formArray.removeAt(index);
        alert('Entry deleted successfully');
      });
    }
  }



}
