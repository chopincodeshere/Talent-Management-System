import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, startWith, map } from 'rxjs';

@Component({
  selector: 'app-education',
  templateUrl: './education.component.html',
  styleUrls: ['./education.component.css'],
})
export class EducationComponent implements OnInit {
  educationForm: FormGroup;
  maxDate: Date;

  // Degree Control
  degrees: string[] = [
    'Bachelor of Arts (BA)',
    'Bachelor of Science (BSc)',
    'Bachelor of Commerce (BCom)',
    'Bachelor of Engineering (BE)',
    'Bachelor of Technology (BTech)',
    'Bachelor of Business Administration (BBA)',
    'Bachelor of Computer Applications (BCA)',
    'Bachelor of Architecture (BArch)',
    'Bachelor of Pharmacy (BPharm)',
    'Bachelor of Education (BEd)',
    'Bachelor of Law (LLB)',
    'Bachelor of Fine Arts (BFA)',
    'Master of Arts (MA)',
    'Master of Science (MSc)',
    'Master of Commerce (MCom)',
    'Master of Engineering (ME)',
    'Master of Technology (MTech)',
    'Master of Business Administration (MBA)',
    'Master of Computer Applications (MCA)',
    'Master of Architecture (MArch)',
    'Master of Pharmacy (MPharm)',
    'Master of Education (MEd)',
    'Master of Law (LLM)',
    'Master of Fine Arts (MFA)',
    'Doctor of Philosophy (PhD)',
  ];
  filteredDegrees: Observable<string[]>;

  // Specialization Control
  specializations: string[] = [
    'Computer Science and Engineering',
    'Electronics and Communication Engineering',
    'Mechanical Engineering',
    'Civil Engineering',
    'Electrical Engineering',
    'Chemical Engineering',
    'Information Technology',
    'Bioinformatics',
    'Biotechnology',
    'Data Science',
    'Artificial Intelligence',
    'Robotics',
    'Business Management',
    'Finance',
    'Marketing',
    'Human Resources',
    'Operations Management',
    'International Relations',
    'Economics',
    'Psychology',
    'Sociology',
    'English Literature',
    'Mathematics',
    'Physics',
    'Chemistry',
    'Pharmacy',
    'Education',
    'Law',
    'Fine Arts',
  ];
  filteredSpecializations: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<EducationComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.educationForm = this.formBuilder.group({
      highestDegree: ['', [Validators.required, Validators.pattern('^[^0-9]+$')]],
      specialization: [''],
      yearOfAchievement: [''],
    });    

    if (this.data.education) {
      this.educationForm.setValue(this.data.education);
    }
  }

  ngOnInit() {
    this.maxDate = new Date();

    this.filteredDegrees = this.highestDegree!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterDegrees(value || ''))
    );

    this.filteredSpecializations = this.specialization!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSpecializations(value || ''))
    );
  }

  private _filterDegrees(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.degrees.filter((option) =>
      option.toLowerCase().startsWith(filterValue)
    );
  }

  private _filterSpecializations(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.specializations.filter((option) =>
      option.toLowerCase().startsWith(filterValue)
    );
  }

  get highestDegree() {
    return this.educationForm.get('highestDegree');
  }

  get specialization() {
    return this.educationForm.get('specialization');
  }

  get yearOfAchievement() {
    return this.educationForm.get('yearOfAchievement');
  }

  closeDialog(): void {
    this.dialogRef.close({ updated: false });
  }

  checkFormValidation(): boolean {
    // Check for invalid fields
    if (this.educationForm.invalid) {
      Object.keys(this.educationForm.controls).forEach((controlName) => {
        const control = this.educationForm.get(controlName);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      // Iterate through the form controls and log the invalid fields
      const invalidFields = Object.keys(this.educationForm.controls).filter(
        (controlName) => this.educationForm.controls[controlName].invalid
      );
      const errorMessage = `Invalid fields: ${invalidFields.join(', ')}`;
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000, // Duration in milliseconds
        panelClass: 'error-snackbar', // CSS class to style the snackbar as an error message
      });

      return false;
    }

    return true;
  }

  submitEducation(): void {
    if (this.checkFormValidation()) {
      this.dialogRef.close({ updated: true, data: this.educationForm.value });
    }
  }
}
