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
import { Class, Officer, KitItem } from 'src/common/common.types';
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";

@Component({
  selector: 'kit-item-issued',
  imports: [SailorListComponent, CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDatepickerModule, MatIconModule],
  templateUrl: './kit-item-issued.html',
  styleUrl: './kit-item-issued.css'
})
export class KitItemIssued {

  protected classId: string = '';
  protected sailorsInClass: Officer[] = [];
  protected classDetails: Class | null = null;
  protected selectedOfficer: Officer | null = null;
  protected officerKitItems: KitItem[] = [];

  protected kitItemForm: FormGroup = new FormGroup({
    kitItems: new FormArray([])
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
    this.resetForm();
    this.fetchOfficerKitItems(selectedOfficer.id);
  }

  private resetForm() {
    // Completely reset the FormArray
    while (this.kitItemsArray.length !== 0) {
      this.kitItemsArray.removeAt(0);
    }
    
    // Reset the form state
    this.kitItemForm.reset();
    
    // Force change detection
    this.cdr.detectChanges();
  }

  private fetchOfficerKitItems(officerId: string) {
    this.http.get<KitItem[]>(`${baseUrl}/data-entry/officer/${officerId}/kit-items`).subscribe((data) => {
      this.officerKitItems = data;
      this.populateFormWithKitItems(data);
    })
  }

  private populateFormWithKitItems(kitItems: KitItem[]) {
    // The form should already be reset by resetForm(), but ensure it's empty
    if (this.kitItemsArray.length > 0) {
      console.warn('FormArray not empty before populating, clearing it...');
      while (this.kitItemsArray.length !== 0) {
        this.kitItemsArray.removeAt(0);
      }
    }

    // Populate form array with existing data
    kitItems.forEach((item) => {
      const formGroup = this.createKitItemFormGroup(item);
      this.kitItemsArray.push(formGroup);
    });

    // Add empty row if no data exists
    if (this.kitItemsArray.length === 0) {
      this.addNewRow();
    }

    // Force change detection to update the view
    this.cdr.detectChanges();
  }

  private createKitItemFormGroup(item?: KitItem): FormGroup {
    return new FormGroup({
      id: new FormControl(item?.id || ''),
      item: new FormControl(item?.item || '', Validators.required),
      quantity: new FormControl(item?.quantity || '', Validators.required),
      issueDate: new FormControl(item?.issueDate || '', Validators.required),
      dueDate: new FormControl(item?.dueDate || '', Validators.required)
    });
  }

  protected get kitItemsArray() {
    return this.kitItemForm.get('kitItems') as FormArray;
  }

  protected addNewRow() {
    const newRow = this.createKitItemFormGroup();
    this.kitItemsArray.push(newRow);
  }

  protected removeRow(index: number) {
    this.removeKitItem(this.kitItemsArray, index);
  }

  protected onSave() {
    if (!this.selectedOfficer) {
      alert('Please select an officer first');
      return;
    }

    const formValue = this.kitItemForm.value;
    const { kitItems } = formValue;

    if (!this.isEmptyArray(kitItems)) {
      this.saveKitItems(kitItems);
    } else {
      alert('No data to save. Please fill in at least one field.');
    }
  }

  private isEmptyArray(arr: any[]): boolean {
    if (arr.length === 0) return true;
    for (const item of arr) {
      // Check if any of the required fields have meaningful values
      if ((item.item && item.item.trim()) ||
        (item.quantity && item.quantity.toString().trim()) ||
        (item.issueDate && item.issueDate.toString().trim()) ||
        (item.dueDate && item.dueDate.toString().trim())) {
        return false;
      }
    }
    return true;
  }

  private saveKitItems(kitItems: KitItem[]) {
    // Filter records into new and existing
    const newItems = kitItems.filter(item => !item.id);
    const existingItems = kitItems.filter(item => item.id);

    // Prepare promises for both POST and PUT calls
    const promises = [];

    // POST call for new items
    if (newItems.length > 0) {
      const postPayload = newItems.map(item => ({
        item: item.item,
        quantity: item.quantity,
        issueDate: item.issueDate,
        dueDate: item.dueDate,
        officerId: this.selectedOfficer?.id
      }));

      promises.push(
        this.http.post(`${baseUrl}/data-entry/officer/${this.selectedOfficer?.id}/kit-items`, postPayload).toPromise()
      );
    }

    // PUT call for existing items
    if (existingItems.length > 0) {
      const putPayload = existingItems.map(item => ({
        id: item.id,
        item: item.item,
        quantity: item.quantity,
        issueDate: item.issueDate,
        dueDate: item.dueDate
      }));

      promises.push(
        this.http.put(`${baseUrl}/data-entry/kit-items`, putPayload).toPromise()
      );
    }

    // Execute all promises
    if (promises.length > 0) {
      Promise.all(promises).then(() => {
        alert('Kit items saved successfully');
        this.fetchOfficerKitItems(this.selectedOfficer!.id);
      }).catch(error => {
        console.error('Error saving kit items:', error);
        alert('Error saving kit items');
      });
    }
  }

  private removeKitItem(formArray: FormArray, index: number) {
    const element = formArray.at(index);
    if (element.value.id) {
      // If the entry has an ID, delete it from the backend first
      this.http.delete(`${baseUrl}/data-entry/kit-items/${element.value.id}`).subscribe(() => {
        formArray.removeAt(index);
        console.log('Kit item removed successfully');

        // If the array becomes empty, add a new empty row
        if (formArray.length === 0) {
          const newRow = this.createKitItemFormGroup();
          formArray.push(newRow);
        }
      });
    } else {
      // If the entry doesn't have an ID, just remove it from the form
      formArray.removeAt(index);

      // If the array becomes empty, add a new empty row
      if (formArray.length === 0) {
        const newRow = this.createKitItemFormGroup();
        formArray.push(newRow);
      }
    }
  }

}
