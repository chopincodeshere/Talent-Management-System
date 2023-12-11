import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { Candidate } from 'src/app/core/models/candidate';
import { HttpErrorResponse } from '@angular/common/http';
import { map, Observable, startWith } from 'rxjs';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { JobService } from 'src/app/services/job-service/job.service';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-skills-form',
  templateUrl: './skills-form.component.html',
  styleUrls: ['./skills-form.component.css'],
})
export class SkillsFormComponent implements OnInit {
  submitted: boolean = false;

  separatorKeysCodes: number[] = [ENTER, COMMA];
  skillCtrl = new FormControl('', [Validators.required]);
  moreSkillCtrl = new FormControl('');

  filteredSkills: Observable<string[]>;
  filteredMoreSkills: Observable<string[]>;

  skills: string[] = [];
  moreSkills: string[] = [];

  positions: JobResponse[] = [];
  selectedJobId: number;

  jobCount: number;

  allSkills: string[] = [
    'HTML',
    'CSS',
    'JavaScript',
    'Java',
    'C',
    'C++',
    'C#',
    'Python',
    'Go',
    'R',
    'PHP',
    'React',
    'Angular',
    'MongoDB',
    '.NET',
  ];

  disabled = false;
  max = 10;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;

  submitting: boolean = false;

  referBuddyForm = JSON.parse(sessionStorage.getItem('formdata') || '{}');
  moreDetails: FormGroup;

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('moreSkillInput') moreSkillInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private candidateService: CandidateService,
    private jobService: JobService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.moreDetails = this.formBuilder.group({
      firstName: this.referBuddyForm.firstName,
      lastName: this.referBuddyForm.lastName,
      email: this.referBuddyForm.email,
      address: {
        currentAddress: {
          currentCountry:
            this.referBuddyForm.address?.currentAddress?.currentCountry,
          currentState:
            this.referBuddyForm.address?.currentAddress?.currentState,
          currentCity: this.referBuddyForm.address?.currentAddress?.currentCity,
        },
        permanentAddress: {
          permanentCountry:
            this.referBuddyForm.address?.permanentAddress?.permanentCountry,
          permanentState:
            this.referBuddyForm.address?.permanentAddress?.permanentState,
          permanentCity:
            this.referBuddyForm.address?.permanentAddress?.permanentCity,
        },
      },
      mobilePhone: this.referBuddyForm.mobilePhone,
      links: this.referBuddyForm.links
        ? this.formBuilder.array(this.referBuddyForm.links)
        : this.formBuilder.array([]),
      employment: this.referBuddyForm.employment
        ? this.formBuilder.array(this.referBuddyForm.employment)
        : this.formBuilder.array([]),
      education: this.referBuddyForm.education,
      source: this.referBuddyForm.source,
      referral: this.referBuddyForm.referral,
      note: this.referBuddyForm.note,
      resume: [this.referBuddyForm.resume, Validators.required],
      keySkills: [this.skills],
      mayKnowSkills: [this.moreSkills],
      totalExperience: ['', Validators.required],
      currentCTC: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')],
      ],
      expectedCTC: [
        '',
        [Validators.required, Validators.pattern('^[0-9]+(.[0-9]{1,2})?$')],
      ],
      currentNoticePeriod: ['', Validators.required],
      job_id: [Number(''), Validators.required],
      workMode: 'Work from office',
      communicationSkills: [''],
    });

    this.filteredSkills = this.skillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) =>
        skill ? this._filter(skill) : this.allSkills.slice()
      )
    );

    this.filteredMoreSkills = this.moreSkillCtrl.valueChanges.pipe(
      startWith(null),
      map((skill: string | null) =>
        skill ? this._filter(skill) : this.allSkills.slice()
      )
    );
  }

  ngOnInit(): void {
    this.getJobCount();
  }

  // Get Methods
  get totalExperience() {
    return this.moreDetails.get('totalExperience');
  }

  get currentCTC() {
    return this.moreDetails.get('currentCTC');
  }

  get expectedCTC() {
    return this.moreDetails.get('expectedCTC');
  }

  get currentNoticePeriod() {
    return this.moreDetails.get('currentNoticePeriod');
  }

  get workMode() {
    return this.moreDetails.get('workMode');
  }

  get job_id() {
    return this.moreDetails.get('job_id');
  }

  get communicationSkills() {
    return this.moreDetails.get('communicationSkills');
  }

  closeAlert() {
    this.submitted = false;
  }

  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();

    // Add Skill if it does not already exist (case-insensitive) in the skills array
    if (value && !this.skills.some((skill) => skill.toLowerCase() === value)) {
      this.skills.push(event.value.trim());
    } else {
      this.snackBar.open('Skill has already been added', 'Close', {
        duration: 2000,
      });
    }

    // Clear the input value
    event.chipInput!.clear();

    this.skillCtrl.setValue(null);
  }

  addMoreSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim().toLowerCase();

    // Add Skill
    if (
      value &&
      !this.moreSkills.some((skill) => skill.toLowerCase() === value)
    ) {
      this.moreSkills.push(event.value.trim());
    } else {
      this.snackBar.open('Skill has already been added', 'Close', {
        duration: 2000,
      });
    }

    // Clear the input value
    event.chipInput!.clear();

    this.moreSkillCtrl.setValue(null);
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  removeMoreSkill(skill: string): void {
    const index = this.moreSkills.indexOf(skill);

    if (index >= 0) {
      this.moreSkills.splice(index, 1);
    }
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    const selectedSkill = event.option.viewValue;

    // Add Skill if it does not already exist (case-insensitive) in the skills array
    if (
      !this.skills.some(
        (skill) => skill.toLowerCase() === selectedSkill.toLowerCase()
      )
    ) {
      this.skills.push(selectedSkill);
    }

    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  selectedMoreSkill(event: MatAutocompleteSelectedEvent): void {
    const selectedSkill = event.option.viewValue;

    if (
      !this.moreSkills.some(
        (skill) => skill.toLowerCase() === selectedSkill.toLowerCase()
      )
    ) {
      this.moreSkills.push(selectedSkill);
    }

    this.moreSkillInput.nativeElement.value = '';
    this.moreSkillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter((skill) =>
      skill.toLowerCase().includes(filterValue)
    );
  }

  getJobCount() {
    this.jobService.getTotalJobCount().subscribe(
      (response) => {
        this.getJobPositions(response);
      },
      (error) =>
        this.snackBar.open(
          'Job count cannot be fetched ' + error.message,
          'Close',
          { duration: 2000 }
        )
    );
  }

  getJobPositions(jobCount: number) {
    this.jobService.getJobs(jobCount).subscribe(
      (response: any) => {
        this.positions = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSubmit(): void {
    if (this.checkFormValidation()) {
      // Disable the Submit button to prevent multiple clicks
      this.submitting = true;

      this.candidateService.addCandidate(this.moreDetails.value).subscribe(
        (response: Candidate) => {
          this.submitted = true;

          setTimeout(() => {
            this.submitted = false;
          }, 2000);

          this.openSnackBar('Form submitted successfully!', 'Close');

          this.router.navigateByUrl('/');
        },
        (error: HttpErrorResponse) => {
          this.checkFormValidation();
          if (error.status === 400) {
            this.openSnackBar(
              'Invalid request. Please check your input.',
              'Close'
            );
          } else if (error.status === 500) {
            this.openSnackBar(
              'An error occurred. Please try again later.',
              'Close'
            );
          } else {
            this.openSnackBar(error.name, 'Close');
          }
        },
        () => {
          // Re-enable the Submit button after the request is complete
          this.submitting = false;
        }
      );
    }

    sessionStorage.clear();
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  checkFormValidation(): boolean {
    // Check for invalid fields
    if (this.moreDetails.invalid) {
      Object.keys(this.moreDetails.controls).forEach((controlName) => {
        const control = this.moreDetails.get(controlName);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      // Iterate through the form controls and log the invalid fields
      const invalidFields = Object.keys(this.moreDetails.controls).filter(
        (controlName) => this.moreDetails.controls[controlName].invalid
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
}
