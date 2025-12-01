import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, ActivatedRoute } from '@angular/router';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { baseUrl } from 'src/common/base';
import { Class, Officer, MovementRecord } from 'src/common/common.types';
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";

@Component({
  selector: 'movement-records',
  imports: [SailorListComponent, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatIconModule],
  templateUrl: './movement-records.html',
  styleUrl: './movement-records.css'
})
export class MovementRecords {
  protected classId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected classDetails: Class | null = null;
  protected selectedOfficer: Officer | null = null;
  protected officerMovementRecords: MovementRecord[] = [];

  protected movementForm: FormGroup = new FormGroup({
    movementRecords: new FormArray([])
  });

  constructor(private router: Router, private activatedRouter: ActivatedRoute, private http: HttpClient, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.activatedRouter?.params?.subscribe((params) => {
      this.classId = params['classId'];
    })
  }

  ngOnInit() {
    this.fetchClassDetails();
    this.fetchOfficersByClassId();
  }

  private fetchClassDetails() {
    this.http.get<Class>(`${baseUrl}/class/${this.classId}`).subscribe((data) => {
      this.classDetails = data;
    })
  }

  private fetchOfficersByClassId() {
    this.http.get<Officer[]>(`${baseUrl}/class/${this.classId}/officers`).subscribe((data) => {
      this.sailorsInClass = data;
    })
  }

  protected onOfficerSelection(selectedOfficer: Officer) {
    this.selectedOfficer = selectedOfficer;
    this.resetForm();
    this.fetchOfficerMovementRecords(selectedOfficer.id);
  }

  private resetForm() {
    // Completely reset the FormArray
    while (this.movementRecordsArray.length !== 0) {
      this.movementRecordsArray.removeAt(0);
    }
    
    // Reset the form state
    this.movementForm.reset();
    
    // Force change detection
    this.cdr.detectChanges();
  }

  private fetchOfficerMovementRecords(officerId: string) {
    this.http.get<MovementRecord[]>(`${baseUrl}/data-entry/officer/${officerId}/movements`).subscribe((data) => {
      this.officerMovementRecords = data;
      this.populateFormWithMovementRecords(data);
    })
  }

  private populateFormWithMovementRecords(movementRecords: MovementRecord[]) {
    // The form should already be reset by resetForm(), but ensure it's empty
    if (this.movementRecordsArray.length > 0) {
      console.warn('FormArray not empty before populating, clearing it...');
      while (this.movementRecordsArray.length !== 0) {
        this.movementRecordsArray.removeAt(0);
      }
    }

    // Populate form array with existing data
    movementRecords.forEach((record) => {
      const formGroup = this.createMovementRecordFormGroup(record);
      this.movementRecordsArray.push(formGroup);
    });

    // Add empty row if no data exists
    if (this.movementRecordsArray.length === 0) {
      this.addNewRow();
    }

    // Force change detection to update the view
    this.cdr.detectChanges();
  }

  private createMovementRecordFormGroup(record?: MovementRecord): FormGroup {
    return new FormGroup({
      id: new FormControl(record?.id || ''),
      from: new FormControl(record?.from || '', Validators.required),
      to: new FormControl(record?.to || '', Validators.required),
      arrival: new FormControl(record?.arrival || '', Validators.required),
      date: new FormControl(record?.date || '', Validators.required),
      draft: new FormControl(record?.draft || '', Validators.required)
    });
  }

  protected get movementRecordsArray() {
    return this.movementForm.get('movementRecords') as FormArray;
  }

  protected addNewRow() {
    const newRow = this.createMovementRecordFormGroup();
    this.movementRecordsArray.push(newRow);
  }

  protected removeRow(index: number) {
    this.removeMovementRecord(this.movementRecordsArray, index);
  }

  protected onSave() {
    if (!this.selectedOfficer) {
      alert('Please select an officer first');
      return;
    }

    const formValue = this.movementForm.value;
    const { movementRecords } = formValue;

    if (!this.isEmptyArray(movementRecords)) {
      this.saveMovementRecords(movementRecords);
    } else {
      alert('No data to save. Please fill in at least one field.');
    }
  }

  private isEmptyArray(arr: any[]): boolean {
    if (arr.length === 0) return true;
    for (const item of arr) {
      // Check if any of the required fields have meaningful values
      if ((item.from && item.from.trim()) ||
        (item.to && item.to.trim()) ||
        (item.arrival && item.arrival.trim()) ||
        (item.date && item.date.toString().trim()) ||
        (item.draft && item.draft.trim())) {
        return false;
      }
    }
    return true;
  }

  private saveMovementRecords(movementRecords: MovementRecord[]) {
    // Filter records into new and existing
    const newRecords = movementRecords.filter(record => !record.id);
    const existingRecords = movementRecords.filter(record => record.id);

    // Prepare promises for both POST and PUT calls
    const promises = [];

    // POST call for new records
    if (newRecords.length > 0) {
      const postPayload = newRecords.map(record => ({
        from: record.from,
        to: record.to,
        arrival: record.arrival,
        date: record.date,
        draft: record.draft,
        officerId: this.selectedOfficer?.id
      }));

      promises.push(
        this.http.post(`${baseUrl}/data-entry/officer/${this.selectedOfficer?.id}/movements`, postPayload).toPromise()
      );
    }

    // PUT call for existing records
    if (existingRecords.length > 0) {
      const putPayload = existingRecords.map(record => ({
        id: record.id,
        from: record.from,
        to: record.to,
        arrival: record.arrival,
        date: record.date,
        draft: record.draft
      }));

      promises.push(
        this.http.put(`${baseUrl}/data-entry/movements`, putPayload).toPromise()
      );
    }

    // Execute all promises
    if (promises.length > 0) {
      Promise.all(promises).then(() => {
        alert('Movement records saved successfully');
        this.fetchOfficerMovementRecords(this.selectedOfficer!.id);
      }).catch(error => {
        console.error('Error saving movement records:', error);
        alert('Error saving movement records');
      });
    }
  }

  private removeMovementRecord(formArray: FormArray, index: number) {
    const element = formArray.at(index);
    if (element.value.id) {
      // If the entry has an ID, delete it from the backend first
      this.http.delete(`${baseUrl}/data-entry/movement/${element.value.id}`).subscribe(() => {
        formArray.removeAt(index);
        console.log('Movement record removed successfully');

        // If the array becomes empty, add a new empty row
        if (formArray.length === 0) {
          const newRow = this.createMovementRecordFormGroup();
          formArray.push(newRow);
        }
      });
    } else {
      // If the entry doesn't have an ID, just remove it from the form
      formArray.removeAt(index);

      // If the array becomes empty, add a new empty row
      if (formArray.length === 0) {
        const newRow = this.createMovementRecordFormGroup();
        formArray.push(newRow);
      }
    }
  }

}
