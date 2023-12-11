import { Component, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Observable, startWith, map } from 'rxjs';
import { EmploymentComponent } from './subcomponents/employment/employment.component';
import { India } from 'src/app/data/IndiaInfo';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { LinksComponent } from './subcomponents/links/links.component';
import { EducationComponent } from './subcomponents/education/education.component';

export type StateCities = {
  [state: string]: {
    id: string;
    name: string;
    state_id: string;
  }[];
};

@Component({
  selector: 'app-candidate-registration-form',
  templateUrl: './candidate-registration-form.component.html',
  styleUrls: ['./candidate-registration-form.component.css'],
})
export class CandidateRegistrationFormComponent {
  @ViewChild(MatAccordion) accordion: MatAccordion;

  sources: string[] = [
    'Newspaper',
    'Social media',
    'Referral from a friend',
    'Job Portal',
    'Agency',
    'Other',
  ];

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

  selectedState: string;
  states: string[] = Object.keys(India.states);
  filteredStates: Observable<string[]>;

  cities: any;
  filteredCities: Observable<any>;

  // referBuddyForm definition
  referBuddyForm: FormGroup;

  resumeFromSessionStorage: any = new FormControl(
    sessionStorage.getItem('resume'),
    Validators.required
  );

  contactLinks: Array<string> = [];
  selectedCity: string;
  selectedPermanentState: any;
  selectedPermanentCity: any;
  filteredPermanentStates: Observable<string[]>;
  filteredPermanentCities: Observable<string[]>;

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // FormGroup Validation
    this.referBuddyForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.pattern('^([A-Z].*)$')]],
      lastName: ['', [Validators.required, Validators.pattern('^([A-Z].*)$')]],
      email: [
        '',
        [
          Validators.required,
          Validators.pattern(
            '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.(com|net|org|edu|in)$'
          ),
        ],
      ],
      address: this.formBuilder.group({
        currentAddress: this.formBuilder.group({
          currentCountry: ['India', Validators.required],
          currentState: ['', Validators.required],
          currentCity: ['', Validators.required],
        }),
        permanentAddress: this.formBuilder.group({
          permanentCountry: ['India', Validators.required],
          permanentState: ['', Validators.required],
          permanentCity: ['', Validators.required],
        }),
      }),
      mobilePhone: ['', [Validators.required, Validators.pattern('[0-9]{10}')]],
      links: this.formBuilder.array([]),
      employment: this.formBuilder.array([
        this.formBuilder.group({
          companyName: [''],
          designation: [''],
          previousCTC: [''],
          location: '',
          workingStatus: '',
          start: '',
          finish: '',
        }),
      ]),
      education: this.formBuilder.group({
        highestDegree: ['', Validators.required],
        specialization: [''],
        yearOfAchievement: [''],
      }),
      source: ['', Validators.required],
      referral: this.formBuilder.group({
        referred_fname: ['', Validators.pattern('^[A-Za-z]+$')],
        referred_lname: ['', Validators.pattern('^[A-Za-z]+$')],
      }),
      note: '',
      resume: ['', Validators.required],
    });
  }

  // OnInit
  ngOnInit(): void {
    this.filteredStates = this.referBuddyForm
      .get('address.currentAddress.currentState')!
      .valueChanges.pipe(
        startWith(''),
        map((state: string) => this.filterStates(state))
      );

    this.filteredCities = this.referBuddyForm
      .get('address.currentAddress.currentCity')!
      .valueChanges.pipe(
        startWith(''),
        map((city: string) => this.filterCities(city))
      );

    this.filteredPermanentStates = this.referBuddyForm
      .get('address.permanentAddress.permanentState')!
      .valueChanges.pipe(
        startWith(''),
        map((state: string) => this.filterPermanentStates(state))
      );

    this.filteredPermanentCities = this.referBuddyForm
      .get('address.permanentAddress.permanentCity')!
      .valueChanges.pipe(
        startWith(''),
        map((city: string) => this.filterPermanentCities(city))
      );

    this.filteredDegrees = this.highestDegree!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterDegrees(value || ''))
    );

    this.filteredSpecializations = this.specialization!.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterSpecializations(value || ''))
    );
  }

  onStateSelected(event: MatAutocompleteSelectedEvent) {
    const selectedState = event.option.value;
    this.selectedState = selectedState;

    const stateCities: StateCities = India.states;
    // Retrieve the cities for the selected state
    const selectedStateCities = stateCities[selectedState];

    // Assign the cities to the 'cities' property
    this.cities = selectedStateCities;
  }

  onPermanentCitySelected(event: MatAutocompleteSelectedEvent) {
    this.selectedCity = event.option.value;
  }

  onPermanentStateSelected(event: MatAutocompleteSelectedEvent) {
    const selectedState = event.option.value;
    this.selectedPermanentState = selectedState;

    const stateCities: StateCities = India.states;
    // Retrieve the cities for the selected state
    const selectedStateCities = stateCities[selectedState];

    // Assign the cities to the 'cities' property
    this.cities = selectedStateCities;
  }

  onCitySelected(event: MatAutocompleteSelectedEvent) {
    this.selectedPermanentCity = event.option.value;
  }

  filterCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (value && this.cities) {
      const filteredCities = Object.values(this.cities)
        .flat()
        .filter((city: any) => {
          return city.name.toLowerCase().includes(filterValue);
        });

      return filteredCities.map((city: any) => city.name);
    }

    return [];
  }

  filterStates(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.states.filter((state: string) =>
      state.toLowerCase().includes(filterValue)
    );
  }

  filterPermanentCities(value: string): string[] {
    const filterValue = value.toLowerCase();
    if (value && this.cities) {
      const filteredPermanentCities = Object.values(this.cities)
        .flat()
        .filter((city: any) => {
          return city.name.toLowerCase().includes(filterValue);
        });

      return filteredPermanentCities.map((city: any) => city.name);
    }

    return [];
  }

  filterPermanentStates(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.states.filter((state: string) =>
      state.toLowerCase().includes(filterValue)
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

  // Set Resume
  setResume() {
    this.referBuddyForm
      .get('resume')!
      .setValue(sessionStorage.getItem('resume'));
  }

  // Get methods for form group
  get firstName() {
    return this.referBuddyForm.get('firstName');
  }

  get lastName() {
    return this.referBuddyForm.get('lastName');
  }

  get email() {
    return this.referBuddyForm.get('email');
  }

  get mobilePhone() {
    return this.referBuddyForm.get('mobilePhone');
  }

  get highestDegree() {
    return this.referBuddyForm.get('education')!.get('highestDegree');
  }

  get specialization() {
    return this.referBuddyForm.get('education')!.get('specialization');
  }

  get yearOfAchievement() {
    return this.referBuddyForm.get('education')!.get('yearOfAchievement');
  }

  get source() {
    return this.referBuddyForm.get('source');
  }

  get note() {
    return this.referBuddyForm.get('note')
      ? this.referBuddyForm.get('note')
      : 'null';
  }

  get referred_fname() {
    return this.referBuddyForm.get('referral')!.get('referred_fname')
      ? this.referBuddyForm.get('referral')!.get('referred_fname')
      : 'null';
  }

  get referred_lname() {
    return this.referBuddyForm.get('referral')!.get('referred_lname')
      ? this.referBuddyForm.get('referral')!.get('referred_lname')
      : 'null';
  }

  // SubForm Validation
  validateEducation(): boolean {
    if (
      this.highestDegree!.invalid ||
      this.specialization!.invalid ||
      this.yearOfAchievement!.invalid
    ) {
      return true;
    }

    return false;
  }

  openEmploymentDialog() {
    const dialogRef = this.dialog.open(EmploymentComponent, {
      data: this.referBuddyForm,
      width: '40rem',
      height: '35rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.updated) {
        this.snackBar.open('Employment has been successfully added.', 'Close', {
          duration: 2000,
        });

        this.referBuddyForm
          .get('employment')
          ?.patchValue(result.data.employment);
      }
    });
  }

  openLinkDialog(): void {
    const dialogRef = this.dialog.open(LinksComponent, {
      data: {
        links: this.referBuddyForm.get('links')?.value,
      },
      width: '40rem',
      height: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.updated) {
        this.snackBar.open('Link has been successfully added.', 'Close', {
          duration: 2000,
        });

        this.referBuddyForm.setControl(
          'links',
          this.formBuilder.array(result.data)
        );
      }
    });
  }

  openEducationDialog(): void {
    const dialogRef = this.dialog.open(EducationComponent, {
      data: { education: this.referBuddyForm.get('education')?.value },
      width: '40rem',
      height: '35rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result.updated) {
        this.snackBar.open('Education has been successfully added.', 'Close', {
          duration: 2000,
        });

        this.referBuddyForm.get('education')?.patchValue({
          highestDegree: result.data.highestDegree,
          specialization: result.data.specialization,
          yearOfAchievement: result.data.yearOfAchievement,
        });
      }
    });
  }

  checkFormValidation(): boolean {
    // Check for invalid fields
    if (this.referBuddyForm.invalid) {
      Object.keys(this.referBuddyForm.controls).forEach((controlName) => {
        const control = this.referBuddyForm.get(controlName);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      // Iterate through the form controls and log the invalid fields
      const invalidFields = Object.keys(this.referBuddyForm.controls).filter(
        (controlName) => this.referBuddyForm.controls[controlName].invalid
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

  onClick() {
    this.setResume();

    if (this.checkFormValidation()) {
      sessionStorage.setItem(
        'formdata',
        JSON.stringify(this.referBuddyForm.value)
      );

      this.router.navigateByUrl('/candidate-pool/add-candidate/more-details');
    }
  }
}
