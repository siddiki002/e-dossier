import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { baseUrl } from 'src/common/base';
import { Class, Medical, Officer } from 'src/common/common.types';
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";

@Component({
  selector: 'medical-records',
  imports: [SailorListComponent, CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatIconModule],
  templateUrl: './medical-records.html',
  styleUrl: './medical-records.css'
})
export class MedicalRecords {

  protected classId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected classDetails: Class | null = null;
  protected selectedOfficer: Officer | null = null;
  protected officerMedicalRecords: Medical[] = [];

  protected medicalForm: FormGroup = new FormGroup({
    medicalRecords: new FormArray([])
  });

  constructor(private router: Router, private activatedRouter: ActivatedRoute, private http: HttpClient, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.sailorsInClass = this.router?.currentNavigation()?.extras?.state?.['data'] || [];
    this.activatedRouter?.params?.subscribe((params) => {
      this.classId = params['classId'];
    })
  }

  ngOnInit() {
      this.fetchClassDetails();
    }
  
  private fetchClassDetails() {
    this.http.get<Class>(`${baseUrl}/class/${this.classId}`).subscribe((data) => {
      this.classDetails = data;
    })
  }

  protected onOfficerSelection(selectedOfficer: Officer) {
    this.selectedOfficer = selectedOfficer;
    this.resetForm(); // Reset form before loading new data
    this.fetchOfficerMedicalRecords(selectedOfficer.id);
  }

  private resetForm() {
    // Completely reset the FormArray
    while (this.medicalRecordsArray.length !== 0) {
      this.medicalRecordsArray.removeAt(0);
    }
    
    // Reset the form state
    this.medicalForm.reset();
    
    // Force change detection
    this.cdr.detectChanges();
  }

  private fetchOfficerMedicalRecords(officerId: string) {
    this.http.get<Medical[]>(`${baseUrl}/data-entry/officer/${officerId}/medical`).subscribe((data) => {
      this.officerMedicalRecords = data;
      this.populateFormWithMedicalRecords(data);
    })
  }

  private populateFormWithMedicalRecords(medicalRecords: Medical[]) {

    // The form should already be reset by resetForm(), but ensure it's empty
    if (this.medicalRecordsArray.length > 0) {
      console.warn('FormArray not empty before populating, clearing it...');
      while (this.medicalRecordsArray.length !== 0) {
        this.medicalRecordsArray.removeAt(0);
      }
    }

    // Populate form array with existing data
    medicalRecords.forEach((record, index) => {
      const formGroup = this.createMedicalRecordFormGroup(record);
      this.medicalRecordsArray.push(formGroup);
    });

    // Add empty row if no data exists
    if (this.medicalRecordsArray.length === 0) {
      this.addNewRow();
    }

    // Force change detection to update the view
    this.cdr.detectChanges();
  }

  private createMedicalRecordFormGroup(record?: Medical): FormGroup {
    return new FormGroup({
      id: new FormControl(record?.id || ''),
      date: new FormControl(record?.date || '', Validators.required),
      disease: new FormControl(record?.disease || '', Validators.required),
      remarks: new FormControl(record?.remarks || '', Validators.required)
    });
  }

  protected get medicalRecordsArray() {
    return this.medicalForm.get('medicalRecords') as FormArray;
  }

  protected addNewRow() {
    const newRow = this.createMedicalRecordFormGroup();
    this.medicalRecordsArray.push(newRow);
  }

  protected removeRow(index: number) {
    this.removeMedicalRecord(this.medicalRecordsArray, index);
  }

  protected onSave() {
    if (!this.selectedOfficer) {
      alert('Please select an officer first');
      return;
    }

    const formValue = this.medicalForm.value;
    const { medicalRecords } = formValue;

    if (!this.isEmptyArray(medicalRecords)) {
      this.saveMedicalRecords(medicalRecords);
    } else {
      alert('No data to save. Please fill in at least one field.');
    }
  }

  private isEmptyArray(arr: any[]): boolean {
    if (arr.length === 0) return true;
    for (const item of arr) {
      // Check if any of the required fields have meaningful values
      if ((item.date && item.date.toString().trim()) ||
        (item.disease && item.disease.trim()) ||
        (item.remarks && item.remarks.trim())) {
        return false;
      }
    }
    return true;
  }

  private saveMedicalRecords(medicalRecords: Medical[]) {
    // Filter out entries that already have an ID (already saved)
    const newRecords = medicalRecords.filter(record => !record.id);

    // If no new records to save, return early
    if (newRecords.length === 0) {
      return;
    }

    const payload = newRecords.map(record => ({
      date: record.date,
      disease: record.disease,
      remarks: record.remarks,
      officerId: this.selectedOfficer?.id
    }));

    this.http.post(`${baseUrl}/data-entry/officer/${this.selectedOfficer?.id}/medical-records`, payload).subscribe((response: any) => {
      alert('Medical records saved successfully');

      this.fetchOfficerMedicalRecords(this.selectedOfficer!.id);
    });
  }

  private removeMedicalRecord(formArray: FormArray, index: number) {
    const element = formArray.at(index);
    if (element.value.id) {
      // If the entry has an ID, delete it from the backend first
      this.http.delete(`${baseUrl}/data-entry/medical/${element.value.id}`).subscribe(() => {
        formArray.removeAt(index);
        console.log('Medical record removed successfully');

        // If the array becomes empty, add a new empty row
        if (formArray.length === 0) {
          const newRow = this.createMedicalRecordFormGroup();
          formArray.push(newRow);
        }
      });
    } else {
      // If the entry doesn't have an ID, just remove it from the form
      formArray.removeAt(index);

      // If the array becomes empty, add a new empty row
      if (formArray.length === 0) {
        const newRow = this.createMedicalRecordFormGroup();
        formArray.push(newRow);
      }
    }
  }

}
