import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FeedbacksComponent } from './feedbacks.component';
import { ActivatedRoute, Params } from '@angular/router';
import { of, throwError } from 'rxjs';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { JobService } from 'src/app/services/job-service/job.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { CandidateFeedback } from 'src/app/core/models/CandidateFeedback';
import { HttpErrorResponse } from '@angular/common/http';

describe('FeedbacksComponent', () => {
  let component: FeedbacksComponent;
  let fixture: ComponentFixture<FeedbacksComponent>;
  let candidateService: CandidateService;
  let jobService: JobService;
  let route: ActivatedRoute;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, MaterialModule, RouterTestingModule],
      declarations: [FeedbacksComponent],
      providers: [
        CandidateService,
        JobService,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ candidateId: 1 }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbacksComponent);
    component = fixture.componentInstance;
    candidateService = TestBed.inject(CandidateService);
    jobService = TestBed.inject(JobService);

    route = TestBed.inject(ActivatedRoute);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchJobs', () => {
    it('should fetch jobs and populate the positions array', () => {
      // Create a spy object for the getJobs() method
      const getJobsSpy = spyOn(jobService, 'getJobs').and.returnValue(
        of([
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
            hiringManagers: ['Jaydeep Chhasatia', 'Ashish Patel', 'Mickeal A.'],
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
        ])
      );

      component.fetchJobs();

      // Expect the spy object to have been called
      expect(getJobsSpy).toHaveBeenCalled();
      // Expect the positions array to be populated with the returned jobs
      expect(component.positions).toEqual([
        {
          id: 1,
          jobTitle: 'Sr. Java Software Engineer(OP)',
          hiringManagers: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
          jobStatus: 'closed',
          jobDescription: null,
          requirements: 'Job Requirements',
        },
        {
          id: 2,
          jobTitle: 'Java Software Engineer (OP)',
          hiringManagers: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
          jobStatus: 'open',
          jobDescription: null,
          requirements: 'Job Requirements',
        },
        {
          id: 3,
          jobTitle: 'QA Engineer - Automation (OP)',
          hiringManagers: ['Jaydeep Chhasatia', 'Ashish Patel', 'Mickeal A.'],
          jobStatus: 'open',
          jobDescription: null,
          requirements: 'Job Requirements',
        },
        {
          id: 4,
          jobTitle: 'Sr. QA Engineer(QT)',
          requirements: 'Job Requirements',
          hiringManagers: [
            'Jaydeep Chhasatia',
            'Cristian Oancea',
            'Dan Mihalache',
          ],
          jobStatus: 'open',
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
      ]);
    });

    it('should show an alert if there is an error in the API response', () => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });
      spyOn(window, 'alert');
      spyOn(jobService, 'getJobs').and.returnValue(throwError(errorResponse));
      component.fetchJobs();
      expect(jobService.getJobs).toHaveBeenCalled();
      expect(window.alert).toHaveBeenCalledWith(errorResponse);
    });
  });

  describe('fetchFeedbacks', () => {
    it('should fetch candidate feedbacks and populate the candidateFeedbacks array', () => {
      const mockFeedbacks: CandidateFeedback[] = [
        {
          candidateName: 'Marina Lang',
          dateOfInterview: new Date('2023-06-01'),
          positionAppliedFor: 4,
          interviewer: 'Gianluca La Brusco',
          round: 2,
          educationalBackgroundRating: 2,
          workExperienceRating: 10,
          communicationSkillsRating: 10,
          candidateInterestRating: 4,
          interpersonalSkillsRating: 9,
          overallRating: 1,
          comments:
            'A possimus explicabo consequatur sint sed eum fugiat recusandae esse. Porro fugiat reprehenderit quasi ducimus aliquam. Aut animi quae impedit dolorem commodi ratione harum. Delectus explicabo ad ratione omnis.',
          result: 'On hold',
          technicalSkillsRating: 4,
        },
        {
          candidateName: 'Rickie Abbott',
          dateOfInterview: new Date('2023-06-02'),
          positionAppliedFor: 4,
          interviewer: 'Ashish Patel',
          round: 2,
          educationalBackgroundRating: 4,
          workExperienceRating: 7,
          communicationSkillsRating: 5,
          candidateInterestRating: 4,
          interpersonalSkillsRating: 10,
          overallRating: 3,
          comments:
            'Impedit consectetur sint corrupti eveniet consequuntur assumenda. Non dignissimos molestias eveniet accusantium minus sequi nihil dicta. Unde inventore debitis dolorem temporibus harum animi ipsam natus mollitia. Eum magnam sit corrupti maiores ducimus natus esse. Pariatur libero autem dicta nobis placeat maxime saepe placeat.',
          result: 'On hold',
          technicalSkillsRating: 3,
        },
        {
          candidateName: 'Carleton Wiegand',
          dateOfInterview: new Date('2023-06-01'),
          positionAppliedFor: 4,
          interviewer: 'Dan Mihalache',
          round: 1,
          educationalBackgroundRating: 2,
          workExperienceRating: 10,
          communicationSkillsRating: 6,
          candidateInterestRating: 9,
          interpersonalSkillsRating: 3,
          overallRating: 8,
          comments:
            'Unde similique saepe sint provident eligendi quidem pariatur quis. Id ipsum expedita atque. Officiis ullam doloribus inventore explicabo fugit ex eveniet molestiae. Temporibus placeat dignissimos molestias dolores. Quis blanditiis nisi ratione eveniet inventore eveniet quos laudantium. Officiis quos temporibus rem recusandae cumque omnis soluta.',
          result: 'On hold',
          technicalSkillsRating: 9,
        },
      ];
      spyOn(candidateService, 'getCandidateFeedback').and.returnValue(
        of(mockFeedbacks)
      );
      component.fetchFeedbacks();
      expect(component.candidateFeedbacks).toEqual(mockFeedbacks);
    });

    it('should log an error if there is an error in the API response', () => {
      const errorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      // Set the mock return value for getCandidateFeedback() to throw an error
      spyOn(candidateService, 'getCandidateFeedback').and.callFake(() => {
        return throwError(errorResponse);
      });
      spyOn(console, 'log');

      component.fetchFeedbacks();

      // Expect the getCandidateFeedback() method to have been called with the correct candidateId
      expect(candidateService.getCandidateFeedback).toHaveBeenCalledWith(
        component.candidateId
      );
      // Expect the error to be logged
      expect(console.log).toHaveBeenCalledWith(errorResponse);
    });
  });

  describe('setCandidateId', () => {
    it('should set candidateId when params exist', () => {
      // Arrange
      const params: Params = { candidateId: 123 };
      route.params = of(params);

      // Act
      component.setCandidateId();

      // Assert
      expect(component.candidateId).toBe(+params.candidateId);
    });

    it('should not set candidateId when params do not exist', () => {
      // Arrange
      route.params = of({});

      // Act
      component.setCandidateId();

      // Assert
      expect(component.candidateId).toBeUndefined();
    });
  });
});
