import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  FormArray,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatRadioChange } from '@angular/material/radio';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, startWith, map } from 'rxjs';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { Candidate } from 'src/app/core/models/candidate';
import { India } from 'src/app/data/IndiaInfo';
import { EditCandidateFormComponent } from 'src/app/modules/interview-feature/components/edit-candidate-form/edit-candidate-form.component';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { JobService } from 'src/app/services/job-service/job.service';
import { StateCities } from '../candidate-registration-form/candidate-registration-form.component';
import { ResumeUploadComponent } from '../candidate-registration-form/subcomponents/resume-upload/resume-upload.component';

@Component({
  selector: 'app-edit-candidate-all-form',
  templateUrl: './edit-candidate-all-form.component.html',
  styleUrls: ['./edit-candidate-all-form.component.css'],
})
export class EditCandidateAllFormComponent {
  candidateForm: FormGroup;
  maxDate: Date;

  skillCtrl = new FormControl('');
  moreSkillCtrl = new FormControl('');

  filteredSkills: Observable<string[]>;
  filteredMoreSkills: Observable<string[]>;

  skills: string[] = [];
  moreSkills: string[] = [];

  openPositions: JobResponse[] = [];
  selectedJobId: number;

  separatorKeysCodes: number[] = [ENTER, COMMA];

  disabled = false;
  max = 10;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = false;
  value = 0;

  isFresher: boolean;

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

  selectedState: string;
  states: string[] = Object.keys(India.states);
  filteredStates: Observable<string[]>;

  cities: any;
  filteredCities: Observable<any>;
  selectedCity: string;
  selectedPermanentState: any;
  selectedPermanentCity: any;
  filteredPermanentStates: Observable<string[]>;
  filteredPermanentCities: Observable<string[]>;

  selectedFiles: File;
  filename: string;
  filePreview: string;
  InputVar: ElementRef;
  uploaded: boolean = false;
  durationInSeconds: number = 2;
  message: string;
  action: string = 'Ok';
  pdfSrc: string;

  @ViewChild('skillInput') skillInput: ElementRef<HTMLInputElement>;
  @ViewChild('moreSkillInput') moreSkillInput: ElementRef<HTMLInputElement>;

  constructor(
    private formBuilder: FormBuilder,
    private jobService: JobService,
    private snackBar: MatSnackBar,
    private candidateService: CandidateService,
    private dialogRef: MatDialogRef<EditCandidateFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.candidateForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobilePhone: ['', Validators.required],
      address: this.formBuilder.group({
        currentAddress: this.formBuilder.group({
          currentCountry: ['', Validators.required],
          currentState: ['', Validators.required],
          currentCity: ['', Validators.required],
        }),
        permanentAddress: this.formBuilder.group({
          permanentCountry: ['', Validators.required],
          permanentState: ['', Validators.required],
          permanentCity: ['', Validators.required],
        }),
      }),
      education: this.formBuilder.group({
        highestDegree: ['', Validators.required],
        specialization: ['', Validators.required],
        yearOfAchievement: ['', Validators.required],
      }),
      resume: '',
      links: this.formBuilder.array([]),
      source: ['', Validators.required],
      referral: this.formBuilder.group({
        referred_fname: '',
        referred_lname: '',
      }),
      employment: this.formBuilder.array([]),
      note: '',
      keySkills: [this.skills, Validators.required],
      mayKnowSkills: [this.moreSkills],
      totalExperience: ['', Validators.required],
      positionAppliedFor: ['', Validators.required],
      currentCTC: ['', [Validators.required]],
      expectedCTC: ['', [Validators.required]],
      currentNoticePeriod: ['', Validators.required],
      jobId: Number(''),
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

  ngOnInit() {
    this.maxDate = new Date();

    this.filteredStates = this.candidateForm
      .get('address.currentAddress.currentState')!
      .valueChanges.pipe(
        startWith(''),
        map((state: string) => this.filterStates(state))
      );

    this.filteredCities = this.candidateForm
      .get('address.currentAddress.currentCity')!
      .valueChanges.pipe(
        startWith(''),
        map((city: string) => this.filterCities(city))
      );

    this.filteredPermanentStates = this.candidateForm
      .get('address.permanentAddress.permanentState')!
      .valueChanges.pipe(
        startWith(''),
        map((state: string) => this.filterPermanentStates(state))
      );

    this.filteredPermanentCities = this.candidateForm
      .get('address.permanentAddress.permanentCity')!
      .valueChanges.pipe(
        startWith(''),
        map((city: string) => this.filterPermanentCities(city))
      );

    this.getJobPositions();
    this.getCandidateById();
  }

  selectFile(event: any): void {
    this.selectedFiles = event.target.files[0];
    this.filename = this.selectedFiles.name;

    if (this.selectedFiles) {
      const reader = new FileReader();

      reader.onload = () => {
        const base64 = reader.result as string;

        // Extract the Base64 content after the comma
        const base64Content = base64.split(',')[1];

        if (this.isImageType(this.selectedFiles.type)) {
          this.filePreview = base64;
        } else if (this.isPdfType(this.selectedFiles.type)) {
          this.filePreview = base64;
        }

        sessionStorage.setItem('resume', base64Content);
      };

      reader.readAsDataURL(this.selectedFiles);

      const fileNameElement = document.getElementById('file-name');
      fileNameElement!.textContent = `Selected File: ${this.filename}`;

      this.uploaded = true;
      this.message = this.filename + ' uploaded successfully!!!';
      this.openSnackBar();
    }
  }

  isImageType(fileType: string): boolean {
    return fileType.startsWith('image/');
  }

  isPdfType(fileType: string): boolean {
    return fileType === 'application/pdf';
  }

  openSnackBar() {
    this.snackBar.open(this.message, this.action, {
      duration: this.durationInSeconds * 1000,
    });
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

  private setFormValues(candidateData: Candidate): void {
    this.skills = candidateData.keySkills;
    this.moreSkills = candidateData.mayKnowSkills;

    const employmentFormArray = this.candidateForm.get(
      'employment'
    ) as FormArray;

    // Clear existing form groups from the employment form array
    employmentFormArray.clear();

    // Iterate over candidateData.employment and add form groups to the employment form array
    candidateData.employment.forEach((employmentItem) => {
      employmentFormArray.push(
        this.formBuilder.group({
          companyName: employmentItem.companyName,
          designation: employmentItem.designation,
          previousCTC: employmentItem.previousCTC,
          location: employmentItem.location,
          start: employmentItem.start,
          finish: employmentItem.finish,
        })
      );
    });

    this.candidateForm.patchValue({
      firstName: candidateData.firstName,
      lastName: candidateData.lastName,
      email: candidateData.email,
      mobilePhone: candidateData.mobilePhone,
      education: {
        highestDegree: candidateData.education.highestDegree,
        specialization: candidateData.education.specialization,
        yearOfAchievement: candidateData.education.yearOfAchievement,
      },
      links: candidateData.links,
      address: candidateData.address,
      source: candidateData.source,
      referral: {
        referred_fname: candidateData.referral.referred_fname,
        referred_lname: candidateData.referral.referred_lname,
      },
      note: candidateData.note,
      totalExperience: candidateData.totalExperience,
      positionAppliedFor: candidateData.job_id,
      currentCTC: candidateData.currentCTC,
      expectedCTC: candidateData.expectedCTC,
      keySkills: candidateData.keySkills,
      mayKnowSkills: candidateData.mayKnowSkills,
      currentNoticePeriod: candidateData.currentNoticePeriod,
      jobId: candidateData.job_id,
      workMode: candidateData.workMode,
      communicationSkills: candidateData.communicationSkills,
    });
  }

  addEmploymentHistory(): FormGroup {
    const employment = this.candidateForm.get('employment') as FormArray;
    employment.push(
      this.formBuilder.group({
        companyName: [''],
        designation: [''],
        previousCTC: [''],
        location: [''],
        workingStatus: [''],
        start: [new Date()],
        finish: [new Date()],
      })
    );

    return this.formBuilder.group({
      companyName: [''],
      designation: [''],
      previousCTC: [''],
      location: [''],
      workingStatus: [''],
      start: [new Date()],
      finish: [new Date()],
    });
  }

  // Function to remove employment from the candidateForm's employment array
  removeEmployment(index: number): void {
    const employmentFormArray = this.candidateForm.get(
      'employment'
    ) as FormArray;
    employmentFormArray.removeAt(index);
  }

  // Function to add a new employment entry to the candidateForm's employment array
  addEmployment(): void {
    const employmentFormArray = this.candidateForm.get(
      'employment'
    ) as FormArray;

    employmentFormArray.push(
      this.formBuilder.group({
        companyName: '',
        designation: '',
        previousCTC: '',
        location: '',
        workingStatus: '',
        start: '',
        finish: '',
      })
    );
  }

  onCheck(event: MatRadioChange) {
    if (event.value === 'Fresher') {
      this.isFresher = true;
    } else {
      this.isFresher = false;
    }
  }

  addSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add Skill
    if (value) {
      this.skills.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.skillCtrl.setValue(null);
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);

    if (index >= 0) {
      this.skills.splice(index, 1);
    }
  }

  selectedSkill(event: MatAutocompleteSelectedEvent): void {
    this.skills.push(event.option.viewValue);
    this.skillInput.nativeElement.value = '';
    this.skillCtrl.setValue(null);
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.allSkills.filter((skill) =>
      skill.toLowerCase().includes(filterValue)
    );
  }

  selectedMoreSkill(event: MatAutocompleteSelectedEvent): void {
    this.moreSkills.push(event.option.viewValue);
    this.moreSkillInput.nativeElement.value = '';
    this.moreSkillCtrl.setValue(null);
  }

  addMoreSkill(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add Skill
    if (value) {
      this.moreSkills.push(value);
    }

    // Clear the input value
    event.chipInput!.clear();

    this.moreSkillCtrl.setValue(null);
  }

  removeMoreSkill(skill: string): void {
    const index = this.moreSkills.indexOf(skill);

    if (index >= 0) {
      this.moreSkills.splice(index, 1);
    }
  }

  getJobPositions(): any {
    this.jobService.getJobs().subscribe(
      (response: any) => {
        response.forEach((data: JobResponse) => {
          if (data.jobStatus === 'open') {
            this.openPositions.push(data);
          }
        });
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open(
          'Error fetching job positions due to ' + error.message,
          'Close',
          { duration: 2000 }
        );
      }
    );
  }

  getCandidateById(): any {
    this.candidateService.getCandidateById(this.data.id).subscribe(
      (response) => {
        this.setFormValues(response);
      },
      (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.snackBar.open(
            `Candidate with id ${this.data} not found`,
            'Close',
            { duration: 2000 }
          );
        } else if (error.status === 500) {
          this.snackBar.open('Error from the server side', 'Close', {
            duration: 2000,
          });
        } else {
          this.snackBar.open('Error due to ' + error.message, 'Close', {
            duration: 2000,
          });
        }
      }
    );
  }

  closeDialog(): void {
    this.dialogRef.close({
      submitted: false,
    });
  }

  submitForm(): void {
    const formData: Candidate = this.candidateForm.value;

    this.candidateService.updateCandidate(formData, this.data.id).subscribe(
      (updatedCandidate) => {
        // this.snackBar.open('Candidate updated successfully!', 'Close', {
        //   duration: 2000,
        // });

        this.dialogRef.close({
          submitted: true,
          updatedCandidate: updatedCandidate,
        });
      },
      (error: HttpErrorResponse) => {
        if (error.status === 500) {
          this.snackBar.open('Error from the server side.', 'Close', {
            duration: 2000,
          });
        } else {
          this.snackBar.open('Error due to ' + error.message, 'Close', {
            duration: 2000,
          });
        }
      }
    );
  }
}
