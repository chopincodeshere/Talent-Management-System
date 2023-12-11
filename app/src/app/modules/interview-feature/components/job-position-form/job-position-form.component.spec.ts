import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPositionFormComponent } from './job-position-form.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  FormBuilder,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { JobService } from 'src/app/services/job-service/job.service';
import { ModalService } from 'src/app/shared/services/modal.service';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';

describe('JobPositionFormComponent', () => {
  let component: JobPositionFormComponent;
  let fixture: ComponentFixture<JobPositionFormComponent>;
  let jobService: JobService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let router: Router;
  let dialogRef: MatDialogRef<JobPositionFormComponent>;

  beforeEach(async () => {
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatDialogModule,
      ],
      declarations: [JobPositionFormComponent],
      providers: [
        FormBuilder,
        JobService,
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['close']),
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        ModalService,
        Router,
        { provide: MatSnackBar, useValue: snackBar },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPositionFormComponent);
    jobService = TestBed.inject(JobService);
    router = TestBed.inject(Router);
    dialogRef = TestBed.inject(MatDialogRef);

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchJobById', () => {
    it('should populate the form with job data from the server', () => {
      const jobData = {
        id: 1,
        jobTitle: 'Software Engineer',
        jobStatus: 'Open',
        requirements: 'Job Requirements',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobDescription: null,
      };
      spyOn(jobService, 'getJobById').and.returnValue(of(jobData));

      // Set the data property to a dummy value
      component.data = 1;

      // Call the fetchJobById function
      component.fetchJobById();

      expect(jobService.getJobById).toHaveBeenCalledWith(1);
      expect(component.jobPositionForm.value.jobTitle).toBe(jobData.jobTitle);
      expect(component.jobPositionForm.value.jobStatus).toBe(jobData.jobStatus);
      expect(component.jobPositionForm.value.hiringManagers).toEqual(
        jobData.hiringManagers
      );
      expect(component.jobPositionForm.value.jobDescription).toBe(
        jobData.jobDescription
      );
    });

    it('should display an error message if fetching job data fails', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Failed to fetch job data',
        status: 500,
        statusText: 'Internal Server Error',
      });
      spyOn(jobService, 'getJobById').and.returnValue(
        throwError(errorResponse)
      );

      // Set the data property to a dummy value
      component.data = 1;

      // Call the fetchJobById function
      component.fetchJobById();

      expect(jobService.getJobById).toHaveBeenCalledWith(1);
      expect((component as any).snackBar.open).toHaveBeenCalledWith(
        'Failed to fetch job with id 1 due to ' + errorResponse.message,
        'Close',
        { duration: 2000 }
      );
    });
  });

  describe('submitForm', () => {
    beforeEach(async () => {
      const formBuilder: FormBuilder = TestBed.inject(FormBuilder);
      component.jobPositionForm = formBuilder.group({
        id: [null],
        jobTitle: [null, Validators.required],
        jobStatus: [null, Validators.required],
        hiringManagers: [null, Validators.required],
        jobDescription: [null],
      });

      fixture.detectChanges();
      await fixture.whenStable();
    });

    it('should update job if data is present', () => {
      component.data = 1;
      component.jobPositionForm.setValue({
        id: 1,
        jobTitle: 'Software Engineer',
        jobStatus: 'Open',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobDescription: null,
      });

      spyOn(jobService, 'updateJob').and.returnValue(
        of({
          id: 1,
          jobTitle: 'Software Engineer',
          jobStatus: 'Open',
          hiringManagers: ['John Doe', 'Jane Smith'], 
          requirements: 'Job Requirements',
          jobDescription: null,
        })
      );

      component.submitForm();
      expect(dialogRef.close).toHaveBeenCalled();

      expect(jobService.updateJob).toHaveBeenCalledWith(1, {
        id: 1,
        jobTitle: 'Software Engineer',
        jobStatus: 'Open',
        hiringManagers: ['John Doe', 'Jane Smith'],
        requirements: 'Job Requirements',
        jobDescription: null,
      });
      expect(component['dialogRef'].close).toHaveBeenCalled();
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Job has been updated successfully.',
        'Close',
        { duration: 2000 }
      );
    });

    it('should add job if data is not present', () => {
      component.data = null;
      const mockJobData = {
        id: 1,
        jobTitle: 'Software Engineer',
        jobStatus: 'Open',
        hiringManagers: ['John Doe', 'Jane Smith'],
        requirements: 'Job Requirements',
        jobDescription: null,
      };
      component.jobPositionForm.setValue(mockJobData);

      spyOn(jobService, 'postJob').and.returnValue(of(mockJobData));

      component.submitForm();
      expect(dialogRef.close).toHaveBeenCalled();

      expect(jobService.postJob).toHaveBeenCalledWith(mockJobData);
      expect(component['dialogRef'].close).toHaveBeenCalled();
      expect(snackBar.open).toHaveBeenCalledWith(
        'Job has been added successfully.',
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle error when updating the job', () => {
      // Set up mock data and service responses
      const errorResponse = new HttpErrorResponse({
        error: 'Failed to update the job',
        status: 500,
        statusText: 'Internal Server Error',
      });
      spyOn(jobService, 'updateJob').and.returnValue(throwError(errorResponse));

      // Set the component data and form values
      component.data = 1;
      component.jobPositionForm.setValue({
        id: 1,
        jobTitle: 'Software Engineer',
        jobStatus: 'Open',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobDescription: null,
      });

      // Call the submitForm method
      component.submitForm();

      // Assertions for expected behavior
      expect(jobService.updateJob).toHaveBeenCalledWith(1, {
        id: 1,
        jobTitle: 'Software Engineer',
        jobStatus: 'Open',
        requirements: 'Job Requirements',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobDescription: null,
      });
      expect(snackBar.open).toHaveBeenCalledWith(
        'Job cannot be updated due to ' + errorResponse.message,
        'Close',
        { duration: 2000 }
      );
    });

    xit('should display error message when job cannot be added', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'Job cannot be added due to ',
        status: 500,
        statusText: 'Internal Server Error'
      });
      spyOn(jobService, 'postJob').and.returnValue(throwError(errorResponse));

      component.jobPositionForm.controls['jobTitle'].setValue('Test Job Title');
      component.jobPositionForm.controls['jobStatus'].setValue(
        'Test Job Status'
      );
      component.jobPositionForm.controls['hiringManagers'].setValue(
        'Test Hiring Managers'
      );
      component.jobPositionForm.controls['jobDescription'].setValue(null);

      component.submitForm();

      expect(jobService.postJob).toHaveBeenCalledWith(
        component.jobPositionForm.value
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        `Job cannot be added due to ${errorResponse.message}`,
        'Close',
        {
          duration: 2000,
        }
      );
    });

    it('should mark invalid fields as touched and display error message', () => {
      // Set up invalid form control
      const invalidControlName = 'jobTitle';
      component.jobPositionForm.controls[invalidControlName].markAsDirty();

      // Call the submitForm method
      component.submitForm();

      // Assertions for expected behavior
      expect(
        component.jobPositionForm.controls[invalidControlName].touched
      ).toBe(true);
      expect(snackBar.open).toHaveBeenCalledWith(
        jasmine.stringMatching('Invalid fields: jobTitle'),
        'Close',
        {
          duration: 5000,
          panelClass: 'error-snackbar',
        }
      );
    });
  });
});
