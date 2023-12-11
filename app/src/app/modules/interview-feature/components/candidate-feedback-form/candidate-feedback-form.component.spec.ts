import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { CandidateFeedbackFormComponent } from './candidate-feedback-form.component';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { JobService } from 'src/app/services/job-service/job.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { of, throwError } from 'rxjs';
import { CandidateFeedback } from 'src/app/core/models/CandidateFeedback';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('CandidateFeedbackFormComponent', () => {
  let component: CandidateFeedbackFormComponent;
  let fixture: ComponentFixture<CandidateFeedbackFormComponent>;
  let candidateService: CandidateService;
  let jobService: JobService;
  let snackBar: MatSnackBar;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
      ],
      declarations: [CandidateFeedbackFormComponent],
      providers: [CandidateService, MatSnackBar],
      teardown: {destroyAfterEach: false} 
    }).compileComponents();

    component = TestBed.createComponent(
      CandidateFeedbackFormComponent
    ).componentInstance;
    candidateService = TestBed.inject(CandidateService);
    snackBar = TestBed.inject(MatSnackBar);
    jobService = TestBed.inject(JobService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchJobs()', () => {
    it('should fetch jobs and assign the response to positions', () => {
      const mockResponse = [
        {
          id: 1,
          jobTitle: 'Software Engineer',
          hiringManagers: ['John Doe', 'Jane Smith'],
          jobStatus: 'Open',
          requirements: 'Job Requirements',
          jobDescription: null,
        },
        {
          id: 2,
          jobTitle: 'QA Engineer',
          hiringManagers: ['John Doe', 'Jane Smith'],
          jobStatus: 'Open',
          requirements: 'Job Requirements',
          jobDescription: null,
        },
      ];
      spyOn(jobService, 'getJobs').and.returnValue(of(mockResponse));

      component.fetchJobs();

      expect(jobService.getJobs).toHaveBeenCalled();
      expect(component.jobTitles).toEqual(mockResponse.map((job) => job.jobTitle));
    });

    it('should handle error response', () => {
      const mockError = new Error('Test error');
      spyOn(jobService, 'getJobs').and.returnValue(throwError(mockError));
      spyOn(window, 'alert');

      component.fetchJobs();

      expect(jobService.getJobs).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(mockError);
    });
  });

  describe('fetchCandidateName()', () => {
    it('should fetch candidate name and set it in the form', () => {
      const candidateId = 1;
      const candidateName = 'John Doe';
      spyOn(candidateService, 'getCandidateName').and.returnValue(
        of(candidateName)
      );
      const patchValueSpy = spyOn(
        component.candidateFeedbackForm,
        'patchValue'
      );

      component.fetchCandidateName(candidateId);

      expect(candidateService.getCandidateName).toHaveBeenCalledWith(
        candidateId
      );
      expect(patchValueSpy).toHaveBeenCalledWith({
        candidateName: candidateName,
      });
    });

    it('should handle error response', () => {
      const candidateId = 1;
      const mockError = new Error('Test error');
      spyOn(candidateService, 'getCandidateName').and.returnValue(
        throwError(mockError)
      );
      spyOn(console, 'error');

      component.fetchCandidateName(candidateId);

      expect(candidateService.getCandidateName).toHaveBeenCalledWith(
        candidateId
      );
      expect(console.error).toHaveBeenCalledWith(
        'Error fetching candidate name:',
        mockError
      );
    });
  });

  describe('fetchCandidatePosition()', () => {
    it('should fetch candidate position and set it in the form', () => {
      const candidateId = 1;
      const response = 2;
      spyOn(candidateService, 'getCandidatePosition').and.returnValue(
        of(response)
      );
      const patchValueSpy = spyOn(
        component.candidateFeedbackForm,
        'patchValue'
      );

      component.fetchCandidatePosition(candidateId);

      expect(candidateService.getCandidatePosition).toHaveBeenCalledWith(
        candidateId
      );
      expect(patchValueSpy).toHaveBeenCalledWith({
        positionAppliedFor: response,
      });
      expect(component.job_id).toEqual(response);
    });

    it('should handle error response', () => {
      const candidateId = 1;
      const mockError = new Error('Test error');
      spyOn(candidateService, 'getCandidatePosition').and.returnValue(
        throwError(mockError)
      );
      spyOn(window, 'alert');

      component.fetchCandidatePosition(candidateId);

      expect(candidateService.getCandidatePosition).toHaveBeenCalledWith(
        candidateId
      );
      expect(window.alert).toHaveBeenCalledWith(mockError);
    });
  });

  describe('submitFeedback', () => {
    it('should add feedback if form is valid', () => {
      component.candidateId = 1;

      const mockFormData: CandidateFeedback = {
        candidateName: 'John Doe',
        dateOfInterview: new Date(),
        positionAppliedFor: 2,
        interviewer: 'Interviewer',
        educationalBackgroundRating: 5,
        workExperienceRating: 4,
        technicalSkillsRating: 3,
        communicationSkillsRating: 4,
        candidateInterestRating: 5,
        interpersonalSkillsRating: 4,
        overallRating: 4.3,
        comments: 'Feedback comments',
        result: 'Accepted',
      };
      component.candidateFeedbackForm.setValue(mockFormData);

      spyOn(candidateService, 'addCandidateFeedback').and.returnValue(
        of(mockFormData)
      );
      spyOn(component['snackBar'], 'open');

      component.submitFeedback();

      expect(candidateService.addCandidateFeedback).toHaveBeenCalledWith(
        1,
        mockFormData
      );
      expect(component.candidateFeedbackForm.value).toEqual({
        candidateName: null,
        dateOfInterview: null,
        positionAppliedFor: null,
        interviewer: null,
        educationalBackgroundRating: null,
        workExperienceRating: null,
        technicalSkillsRating: null,
        communicationSkillsRating: null,
        candidateInterestRating: null,
        interpersonalSkillsRating: null,
        overallRating: null,
        comments: null,
        result: null,
      });
      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Your Feedback is added successfully!',
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle error when adding feedback', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 500 error',
        status: 500,
        statusText: 'Internal Server Error',
      });

      component.candidateId = 1;

      // Set form value with 'candidateName' control value
      component.candidateFeedbackForm.setValue({
        candidateName: 'John Doe',
        dateOfInterview: new Date(),
        positionAppliedFor: 2,
        interviewer: 'Interviewer',
        educationalBackgroundRating: 5,
        workExperienceRating: 4,
        technicalSkillsRating: 3,
        communicationSkillsRating: 4,
        candidateInterestRating: 5,
        interpersonalSkillsRating: 4,
        overallRating: 4.3,
        comments: 'Feedback comments',
        result: 'Accepted',
      });

      spyOn(candidateService, 'addCandidateFeedback').and.returnValue(
        throwError(errorResponse)
      );
      spyOn(snackBar, 'open');

      component.submitFeedback();

      expect(candidateService.addCandidateFeedback).toHaveBeenCalledWith(1, {
        candidateName: 'John Doe',
        dateOfInterview: jasmine.any(Date),
        positionAppliedFor: 2,
        interviewer: 'Interviewer',
        educationalBackgroundRating: 5,
        workExperienceRating: 4,
        technicalSkillsRating: 3,
        communicationSkillsRating: 4,
        candidateInterestRating: 5,
        interpersonalSkillsRating: 4,
        overallRating: 4.3,
        comments: 'Feedback comments',
        result: 'Accepted',
      });
      expect(snackBar.open).toHaveBeenCalledWith(
        'Failed to add your feedback due to error ' + errorResponse.message,
        'Close',
        { duration: 2000 }
      );
    });

    it('should display error message if form is invalid', () => {
      component.candidateId = 1;

      // Set form value with missing 'candidateName' control value
      component.candidateFeedbackForm.setValue({
        candidateName: 'John Doe',
        dateOfInterview: new Date(),
        positionAppliedFor: 2,
        interviewer: 'Interviewer',
        educationalBackgroundRating: null,
        workExperienceRating: null,
        technicalSkillsRating: null,
        communicationSkillsRating: null,
        candidateInterestRating: null,
        interpersonalSkillsRating: null,
        overallRating: null,
        comments: null,
        result: null,
      });

      spyOn(snackBar, 'open');

      component.submitFeedback();

      expect(snackBar.open).toHaveBeenCalledWith(
        'Invalid fields: educationalBackgroundRating, workExperienceRating, technicalSkillsRating, communicationSkillsRating, candidateInterestRating, interpersonalSkillsRating, overallRating, result',
        'Close',
        { duration: 6000, panelClass: 'error-snackbar' }
      );
    });
  });
});
