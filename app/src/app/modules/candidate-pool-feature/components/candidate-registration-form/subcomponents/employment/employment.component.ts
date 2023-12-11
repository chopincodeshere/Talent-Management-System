import { Component, Inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { EditCandidateFormComponent } from 'src/app/modules/interview-feature/components/edit-candidate-form/edit-candidate-form.component';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.css'],
})
export class EmploymentComponent implements OnInit {
  candidateForm: FormGroup;
  formStatus: string[] = [];
  disableEmployment: boolean = false;
  previousCTC = new FormControl('', Validators.email);

  maxDate: Date;

  matcher = new MyErrorStateMatcher();

  constructor(
    private dialogRef: MatDialogRef<EditCandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.maxDate = new Date();
    this.initializeCandidateForm();
    this.initializeFormStatus();
  }

  initializeCandidateForm() {
    if (!this.candidateForm) {
      this.candidateForm = this.formBuilder.group({
        employment: this.formBuilder.array([this.createEmploymentForm()]),
      });
      this.candidateForm = this.data;
    }
  }

  isPreviousCTCValid(): boolean {
    if (this.candidateForm.get('employment')?.get('previousCTC')?.valid)
      return true;

    return false;
  }

  disableEmploymentButton(): void {
    this.disableEmployment = true;
  }

  enableEmploymentButton(): void {
    this.disableEmployment = false;
  }

  isFresher(index: number): boolean {
    if (this.formStatus[index] === 'Fresher') return true;

    return false;
  }

  isCurrentlyWorking(index: number): boolean {
    if (this.formStatus[index] === 'Working') return true;

    return false;
  }

  isNone(index: number): boolean {
    if (this.formStatus[index] === 'None') return true;

    return false;
  }

  initializeFormStatus() {
    const employmentArray = this.candidateForm.get('employment') as FormArray;
    this.formStatus = Array(employmentArray.length).fill('None');
  }

  closeDialog() {
    this.dialogRef.close({ updated: false });
  }

  removeEmployment(index: number) {
    (this.candidateForm.get('employment') as FormArray).removeAt(index);
    this.formStatus.splice(index, 1);
  }

  onCheck(event: MatRadioChange, index: number) {
    if (event.value === 'Fresher') {
      this.formStatus[index] = 'Fresher';
    } else if (event.value === 'Working') {
      this.formStatus[index] = 'Working';
    } else {
      this.formStatus[index] = 'None';
    }
  }

  createEmploymentForm(): FormGroup {
    return this.formBuilder.group({
      companyName: '',
      designation: '',
      previousCTC: ['', Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')],
      location: '',
      workingStatus: '',
      start: null,
      finish: null,
    });
  }

  get employmentForms() {
    return this.candidateForm.get('employment') as FormArray;
  }

  getTabLabel(index: number): string {
    const employmentCount = this.employmentForms.length;
    return employmentCount === 1 ? 'Form 1' : `Form ${index + 1}`;
  }

  addEmployment() {
    this.employmentForms.push(this.createEmploymentForm());
    this.formStatus.push('None');
  }

  submitForm() {
    this.dialogRef.close({ updated: true, data: this.candidateForm.value });
  }
}
