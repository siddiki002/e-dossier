import { HttpClient, HttpResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
import { baseUrl } from 'src/common/base';
import { Class, Officer } from 'src/common/common.types';
import { SailorListComponent } from "src/common/components/sailor-list/sailor-list.component";
import { MatFormFieldModule } from "@angular/material/form-field";
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { forkJoin, Observable } from 'rxjs';
import { MatDialog, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from "@angular/material/icon";
import { MatSelectModule } from "@angular/material/select";
import { MatTableModule } from "@angular/material/table";

type ApiCalls = {[key: string]: Observable<Object>};
@Component({
  selector: 'personal-information-entry',
  imports: [SailorListComponent, MatFormFieldModule, ReactiveFormsModule, MatInputModule, MatDatepickerModule, MatButtonModule, CommonModule, MatDialogModule, MatIconModule, MatSelectModule, MatTableModule],
  templateUrl: './personal-information-entry.html',
  styleUrl: './personal-information-entry.css'
})
export class PersonalInformationEntry {

  protected classId: string = '';
  protected classDetails: Class | undefined;
  protected sailorsInClass: Officer[] = [];
  protected personalInformationForm: FormGroup = new FormGroup({
    sailorId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required),
    fatherName: new FormControl('', Validators.required),
    cnic: new FormControl('', Validators.required),
    maritalStatus: new FormControl('', Validators.required),
    dateOfBirth: new FormControl('', Validators.required),
    dateOfEnrollment: new FormControl(new Date(), Validators.required),
    bloodGroup: new FormControl('', Validators.required),
    contactNumber: new FormControl('', Validators.required),
    rate: new FormControl('Sailor', Validators.required),
    permanentAddress: new FormControl('', Validators.required),
    emergencyContact: new FormGroup({
      cnic: new FormControl('', Validators.required),
      contactNumber: new FormControl('', Validators.required),
      name: new FormControl('', Validators.required),
      relation: new FormControl('', Validators.required)
    }),
    additionalFamilyInformation: new FormArray([])
  });
  protected officerImageUrl: string = '';
  protected selectedOfficer: Officer | null = null;
  protected selectedFamilyMemberIndex: number = -1; // Track selected family member for editing
  protected displayedColumns: string[] = ['name', 'relation', 'cnic', 'contactNumber'];
  private selectedFile: File | null = null;
  private successDialogRef: MatDialogRef<any,any> | null = null;

  @ViewChild('successDialog') successDialogTemplate: any;

  constructor(private router: Router, private activatedRouter: ActivatedRoute, private http: HttpClient, private dialog: MatDialog) {
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

  private setOfficerDetailsInForm(officer: Officer) {
    this.officerImageUrl = officer.imageUrl || '';
    this.personalInformationForm.get('sailorId')?.setValue(officer.officerId);
    this.personalInformationForm.get('name')?.setValue(officer?.name);
    this.personalInformationForm.get('fatherName')?.setValue(officer?.fatherName);
    this.personalInformationForm.get('cnic')?.setValue(officer?.cnic);
    this.personalInformationForm.get('maritalStatus')?.setValue(officer?.maritalStatus);
    this.personalInformationForm.get('dateOfBirth')?.setValue(officer?.dateOfBirth);
    this.personalInformationForm.get('bloodGroup')?.setValue(officer?.bloodGroup);
    this.personalInformationForm.get('contactNumber')?.setValue(officer?.contactNumber);
    this.personalInformationForm.get('rate')?.setValue(officer?.rate);
    this.personalInformationForm.get('permanentAddress')?.setValue(officer?.permanentAddress);
    this.personalInformationForm.get('emergencyContact.cnic')?.setValue(officer?.emergencyContact?.cnic);
    this.personalInformationForm.get('emergencyContact.contactNumber')?.setValue(officer?.emergencyContact?.contactNumber);
    this.personalInformationForm.get('emergencyContact.name')?.setValue(officer?.emergencyContact?.name);
    this.personalInformationForm.get('emergencyContact.relation')?.setValue(officer?.emergencyContact?.relation);
    this.familyArray.clear();
    this.selectedFamilyMemberIndex = -1; // Reset family member selection
    if(officer?.additionalFamilyInformation && officer.additionalFamilyInformation.length > 0) {
      officer.additionalFamilyInformation.forEach(member => {
        const memberGroup = this.createFamilyMember();
        memberGroup.get('name')?.setValue(member.name);
        memberGroup.get('relation')?.setValue(member.relation);
        memberGroup.get('contactNumber')?.setValue(member.contactNumber);
        memberGroup.get('cnic')?.setValue(member.cnic);
        this.familyArray.push(memberGroup);
      });
    }
  }

  protected onOfficerSelection(officer: Officer) {
    this.selectedOfficer = officer;
    this.setOfficerDetailsInForm(officer);
  }

  protected get emergencyContactFormGroup() {
    return this.personalInformationForm.get('emergencyContact') as FormGroup;
  }

  protected get familyArray() {
    return this.personalInformationForm.get('additionalFamilyInformation') as FormArray;
  }

  protected createFamilyMember() : FormGroup {
    return new FormGroup({
      name: new FormControl(''),
      relation: new FormControl(''),
      contactNumber: new FormControl(''),
      cnic: new FormControl('')
    });
  }

  protected addFamilyMember() {
    this.familyArray.push(this.createFamilyMember());
    // Select the newly added family member for editing
    this.selectedFamilyMemberIndex = this.familyArray.length - 1;
  }

  protected removeFamilyMember(index: number) {
    this.familyArray.removeAt(index);
    // Reset selection if the selected member was removed
    if (this.selectedFamilyMemberIndex === index) {
      this.selectedFamilyMemberIndex = -1;
    } else if (this.selectedFamilyMemberIndex > index) {
      this.selectedFamilyMemberIndex--; // Adjust index after removal
    }
  }

  protected selectFamilyMember(index: number) {
    this.selectedFamilyMemberIndex = index;
  }

  protected get selectedFamilyMemberForm(): FormGroup | null {
    if (this.selectedFamilyMemberIndex >= 0 && this.selectedFamilyMemberIndex < this.familyArray.length) {
      return this.familyArray.at(this.selectedFamilyMemberIndex) as FormGroup;
    }
    return null;
  }

  protected get hasFamilyMembers(): boolean {
    return this.familyArray.length > 0;
  }

  protected onFileSelected(event: Event) {
    console.log(this.selectedOfficer);
    if(!this.selectedOfficer) return;
    const input = event?.target as HTMLInputElement;
    const file = input?.files?.[0]
    if(!file) return;

    this.selectedFile = file;

    // Setting up image for preview
    this.officerImageUrl = URL.createObjectURL(file);
  }

  private submitOfficerImage(){
    if(!this.selectedOfficer || !this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post(`${baseUrl}/data-entry/officer/${this.selectedOfficer?.id}/image`, formData).subscribe((response: any) => {
      console.log(response);
    });
  }

  protected saveOfficerInformation() {

    if(!this.selectedOfficer) return;

    const formValue = this.personalInformationForm.value;

    const body: Partial<Officer> = {
      name: formValue.name,
      fatherName: formValue.fatherName,
      cnic: formValue.cnic,
      maritalStatus: formValue.maritalStatus,
      dateOfBirth: formValue.dateOfBirth,
      bloodGroup: formValue.bloodGroup,
      contactNumber: formValue.contactNumber,
      rate: formValue.rate,
      permanentAddress: formValue.permanentAddress,
      emergencyContact: {
        cnic: formValue.emergencyContact.cnic,
        contactNumber: formValue.emergencyContact.contactNumber,
        name: formValue.emergencyContact.name,
        relation: formValue.emergencyContact.relation
      },
      additionalFamilyInformation: formValue.additionalFamilyInformation
    };

    const calls: ApiCalls = {
      infoUpdate: this.http.put(`${baseUrl}/data-entry/officer/${this.selectedOfficer.id}`, body)
    }

    if(this.selectedFile) {
      calls['imageUpload'] = this.http.post(`${baseUrl}/data-entry/officer/${this.selectedOfficer?.id}/image`, new FormData().append('image', this.selectedFile));
    }

    forkJoin(calls).subscribe({
      next: (results) => {
        console.log('All API calls completed successfully:', results);
        this.openSuccessDialog();
      }
    });
    

  }

  protected openSuccessDialog() {
    this.successDialogRef = this.dialog.open(this.successDialogTemplate);
  }

  protected closeSuccessDialog() {
    this.successDialogRef?.close(); 
  }

}
