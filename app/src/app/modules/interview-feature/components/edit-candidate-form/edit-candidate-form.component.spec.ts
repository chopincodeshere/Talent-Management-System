import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCandidateFormComponent } from './edit-candidate-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormArray,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { JobService } from 'src/app/services/job-service/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';

xdescribe('EditCandidateFormComponent', () => {
  let component: EditCandidateFormComponent;
  let fixture: ComponentFixture<EditCandidateFormComponent>;
  let candidateService: CandidateService;
  let jobService: JobService;
  let dialogRef: MatDialogRef<EditCandidateFormComponent>;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        NgMultiSelectDropDownModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      declarations: [EditCandidateFormComponent],
      providers: [
        CandidateService,
        MatSnackBar,
        JobService,
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['close']),
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditCandidateFormComponent);
    candidateService = TestBed.inject(CandidateService);
    snackBar = TestBed.inject(MatSnackBar);
    jobService = TestBed.inject(JobService);
    dialogRef = TestBed.inject(MatDialogRef);

    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getCandidateById', () => {
    it('should call getCandidateById with correct data', () => {
      spyOn(candidateService, 'getCandidateById').and.callThrough();
      component.data = 1;
      component.getCandidateById();
      expect(candidateService.getCandidateById).toHaveBeenCalledWith(1);
    });

    it('should call setFormValues with response data', () => {
      const response = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        job_id: 2,
        address: {
          currentAddress: {
            currentCountry: 'USA',
            currentState: 'CA',
            currentCity: 'San Francisco',
          },
          permanentAddress: {
            permanentCountry: 'USA',
            permanentState: 'CA',
            permanentCity: 'Los Angeles',
          },
        },
        currentCTC: '100000',
        expectedCTC: '120000',
        totalExperience: '5',
        source: 'LinkedIn',
        keySkills: ['Java', 'Spring', 'Angular'],
        mayKnowSkills: ['Java', 'Spring', 'Angular'],
        mobilePhone: '1234567890',
        education: {
          highestDegree: 'Bachelor',
          specialization: 'Computer Science',
          yearOfAchievement: new Date(),
        },
        workMode: 'Remote',
        round: 1,
        links: [],
        employment: [
          {
            companyName: 'ABC Pvt Ltd.',
            designation: 'Senior Java Developer',
            previousCTC: '18',
            location: 'New York',
            start: new Date('12/06/2006'),
            finish: new Date('21/01/2010'),
            workingStatus: '',
          },
        ],
        referral: {
          referred_fname: 'Ana0',
          referred_lname: 'Vidovic',
        },
        note: '',
        resume: null,
        currentNoticePeriod: '',
        communicationSkills: '',
        stage: '',
      };
      spyOn(candidateService, 'getCandidateById').and.returnValue(of(response));
      spyOn(component as any, 'setFormValues');
      component.getCandidateById();
      expect(component['setFormValues']).toHaveBeenCalledWith(response);
    });

    it('should handle error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });

      spyOn(candidateService, 'getCandidateById').and.returnValue(
        throwError(errorResponse)
      );
      spyOn(component['snackBar'], 'open');

      component.getCandidateById();

      expect(component['snackBar'].open).toHaveBeenCalledWith(
        `Candidate with id ${component.data} not found`,
        'Close',
        { duration: 2000 }
      );
    });
  });

  describe('getJobs', () => {
    it('should call getJobs', () => {
      spyOn(jobService, 'getJobs').and.callThrough();
      component.getJobPositions();
      expect(jobService.getJobs).toHaveBeenCalled();
    });

    it('should update openPositions with open job positions', () => {
      const response: JobResponse[] = [
        {
          id: 1,
          jobTitle: 'Sr. Java Software Engineer(OP)',
          hiringManagers: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
          jobStatus: 'closed',
          requirements: 'Job Requirements',
          jobDescription: null,
        },
        {
          id: 2,
          jobTitle: 'Java Software Engineer (OP)',
          hiringManagers: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
          jobStatus: 'open',
          requirements: 'Job Requirements',
          jobDescription: null,
        },
        {
          id: 3,
          jobTitle: 'QA Engineer - Automation (OP)',
          hiringManagers: ['Jaydeep Chhasatia, Ashish Patel, Mickeal A.'],
          jobStatus: 'open',
          requirements: 'Job Requirements',
          jobDescription: null,
        },
        {
          id: 4,
          jobTitle: 'Sr. QA Engineer(QT)',
          hiringManagers: [
            'Jaydeep Chhasatia',
            'Cristian Oancea',
            'Dan Mihalache',
          ],
          jobStatus: 'open',
          requirements: 'Job Requirements',
          jobDescription: null,
        },
        {
          id: 5,
          jobTitle: 'Sr. Software Engineer - Full Stack(AP)',
          hiringManagers: ['Jaydeep Chhasatia', 'Gianluca La Brusco'],
          jobStatus: 'closed',
          requirements: 'Job Requirements',
          jobDescription: null,
        },
      ];
      spyOn(jobService, 'getJobs').and.returnValue(of(response));
      component.getJobPositions();
      expect(component.openPositions).toEqual([
        {
          id: 2,
          jobTitle: 'Java Software Engineer (OP)',
          hiringManagers: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
          jobStatus: 'open', requirements: 'Job Requirements',
          jobDescription: null,
        },
        {
          id: 3,
          jobTitle: 'QA Engineer - Automation (OP)',
          hiringManagers: ['Jaydeep Chhasatia, Ashish Patel, Mickeal A.'],
          jobStatus: 'open', requirements: 'Job Requirements',
          jobDescription: null,
        },
        {
          id: 4,
          jobTitle: 'Sr. QA Engineer(QT)', requirements: 'Job Requirements',
          hiringManagers: [
            'Jaydeep Chhasatia',
            'Cristian Oancea',
            'Dan Mihalache',
          ],
          jobStatus: 'open',
          jobDescription: null,
        },
      ]);
    });

    it('should display alert with error message', () => {
      const error = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });
      spyOn(jobService, 'getJobs').and.returnValue(throwError(error));
      spyOn(snackBar, 'open');
      component.getJobPositions();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Error fetching job positions due to ' + error.message,
        'Close',
        { duration: 2000 }
      );
    });
  });

  describe('addSkill', () => {
    it('should add a skill to the skills array', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addSkill(event as any);
      expect(component.skills).toContain('test skill');
      expect(event.chipInput.clear).toHaveBeenCalled();
    });

    it('should clear the input value', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addSkill(event as any);
      expect(component.skillCtrl.value).toBeNull();
    });
  });

  describe('addMoreSkill', () => {
    it('should add a skill to the moreSkills array', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addMoreSkill(event as any);
      expect(component.moreSkills).toContain('test skill');
      expect(event.chipInput.clear).toHaveBeenCalled();
    });

    it('should clear the input value', () => {
      const event = {
        value: 'test skill',
        chipInput: { clear: jasmine.createSpy('clear') },
      };
      component.addMoreSkill(event as any);
      expect(component.moreSkillCtrl.value).toBeNull();
    });
  });

  describe('removeSkill', () => {
    it('should remove a skill from the skills array', () => {
      component.skills = ['test skill'];
      component.removeSkill('test skill');
      expect(component.skills).not.toContain('test skill');
    });
  });

  describe('removeMoreSkill', () => {
    it('should remove a skill from the moreSkills array', () => {
      component.moreSkills = ['test skill'];
      component.removeMoreSkill('test skill');
      expect(component.moreSkills).not.toContain('test skill');
    });
  });

  describe('selectedSkill', () => {
    it('should add a selected skill to the skills array', () => {
      const event = { option: { viewValue: 'test skill' } };
      component.selectedSkill(event as any);
      expect(component.skills).toContain('test skill');
    });
  });

  describe('selectedMoreSkill', () => {
    it('should add a selected skill to the moreSkills array', () => {
      const event = { option: { viewValue: 'test skill' } };
      component.selectedMoreSkill(event as any);
      expect(component.moreSkills).toContain('test skill');
    });
  });

  describe('_filter()', () => {
    it('should return a filtered list of skills', () => {
      // Arrange
      component.allSkills = ['JavaScript', 'TypeScript', 'HTML', 'CSS'];
      const value = 'Script';

      // Act
      const result = (component as any)._filter(value);

      // Assert
      expect(result).toEqual(['JavaScript', 'TypeScript']);
    });
  });

  describe('submitForm', () => {
    it('should call updateCandidate with form data and data', () => {
      spyOn(candidateService, 'updateCandidate').and.callThrough();
      component.data = 1;
      component.candidateForm.setControl('employment', new FormArray([]));

      const employmentFormArray = component.candidateForm.get(
        'employment'
      ) as FormArray;
      const employmentFormGroup = new FormGroup({
        companyName: new FormControl('ABC Pvt Ltd.'),
        designation: new FormControl('Senior Java Developer'),
        previousCTC: new FormControl('18'),
        location: new FormControl('New York'),
        start: new FormControl(new Date('12/06/2006')),
        finish: new FormControl(new Date('21/01/2010')),
        workingStatus: new FormControl(''),
      });
      employmentFormArray.push(employmentFormGroup);

      component.candidateForm.patchValue({
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        jobId: 2,
        address: {
          currentAddress: {
            currentCountry: 'USA',
            currentState: 'CA',
            currentCity: 'San Francisco',
          },
          permanentAddress: {
            permanentCountry: 'USA',
            permanentState: 'CA',
            permanentCity: 'Los Angeles',
          },
        },
        currentCTC: '100000',
        expectedCTC: '120000',
        totalExperience: '5',
        source: 'LinkedIn',
        positionAppliedFor: 'Java Software Engineer (OP)',
        keySkills: ['Java', 'Spring', 'Angular'],
        mayKnowSkills: ['Java', 'Spring', 'Angular'],
        mobilePhone: '1234567890',
        education: {
          highestDegree: 'Bachelor',
          specialization: 'Computer Science',
          yearOfAchievement: new Date(),
        },
        workMode: 'Remote',
        round: 1,
        links: [],
        referral: {
          referred_fname: 'Ana0',
          referred_lname: 'Vidovic',
        },
        note: '',
        resume: null,
        currentNoticePeriod: '',
        communicationSkills: '',
        stage: '',
      });

      component.submitForm();

      expect(candidateService.updateCandidate).toHaveBeenCalledWith(
        component.candidateForm.value,
        1
      );
    });

    it('should close dialog with submitted and updatedCandidate data', () => {
      const updatedCandidate = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        job_id: 2,
        address: {
          currentAddress: {
            currentCountry: 'USA',
            currentState: 'CA',
            currentCity: 'San Francisco',
          },
          permanentAddress: {
            permanentCountry: 'USA',
            permanentState: 'CA',
            permanentCity: 'Los Angeles',
          },
        },
        currentCTC: '100000',
        expectedCTC: '120000',
        totalExperience: '5',
        source: 'LinkedIn',
        keySkills: ['Java', 'Spring', 'Angular'],
        mayKnowSkills: ['Java', 'Spring', 'Angular'],
        mobilePhone: '1234567890',
        education: {
          highestDegree: 'Bachelor',
          specialization: 'Computer Science',
          yearOfAchievement: new Date(),
        },
        workMode: 'Remote',
        round: 1,
        links: [],
        employment: [
          {
            companyName: 'ABC Pvt Ltd.',
            designation: 'Senior Java Developer',
            previousCTC: '18',
            location: 'New York',
            start: new Date('12/06/2006'),
            finish: new Date('21/01/2010'),
            workingStatus: '',
          },
        ],
        referral: {
          referred_fname: 'Ana0',
          referred_lname: 'Vidovic',
        },
        note: '',
        resume: null,
        currentNoticePeriod: '',
        communicationSkills: '',
        stage: '',
      };
      spyOn(candidateService, 'updateCandidate').and.returnValue(
        of(updatedCandidate)
      );
      component.submitForm();
      expect(dialogRef.close).toHaveBeenCalledWith({
        submitted: true,
        updatedCandidate: updatedCandidate,
      });
    });

    it('should display alert with error message', () => {
      const error = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });
      spyOn(candidateService, 'updateCandidate').and.returnValue(
        throwError(error)
      );
      spyOn(snackBar, 'open');
      component.submitForm();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Error due to ' + error.message,
        'Close',
        { duration: 2000 }
      );
    });
  });
});
