import { TestBed } from '@angular/core/testing';

import { JobService } from './job.service';
import {
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpEvent,
} from '@angular/common/http';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { JobResponse } from 'src/app/core/models/JobResponse';

describe('JobService', () => {
  let jobService: JobService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [JobService],
    });
    jobService = TestBed.inject(JobService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(jobService).toBeTruthy();
  });

  describe('handleError<T>()', () => {
    it('should return an Observable of type T', () => {
      const operation = 'testOperation';
      const result = 'testResult';
      const error = new Error('Test error');
      const errorHandler = jobService.handleError<string>(operation, result);

      const resultObservable = errorHandler(error);

      resultObservable.subscribe((res) => {
        expect(res).toEqual(result);
      });
    });
  });

  describe('getJobs()', () => {
    it('should retrieve jobs with default parameters', () => {
      // Arrange
      const expectedJobs: JobResponse[] = [
        {
          id: 1,
          jobTitle: 'Software Engineer',
          hiringManagers: ['John Doe', 'Jane Smith'],
          jobStatus: 'Open',
          jobDescription: null,
          requirements: 'Job Requirements',
        },
        // Add more expected jobs as needed
      ];

      // Act
      jobService.getJobs().subscribe((jobs) => {
        // Assert
        expect(jobs).toEqual(expectedJobs);
      });

      // Assert
      const req = httpTestingController.expectOne(
        '/jobs?pageNumber=0&pageSize=5&sortField=id&sortOrder=asc'
      );
      expect(req.request.method).toBe('GET');
      req.flush(expectedJobs);
    });

    it('should retrieve jobs with custom parameters', () => {
      // Arrange
      const pageSize = 10;
      const pageIndex = 2;
      const sortField = 'jobTitle';
      const sortOrder = 'desc';
      const expectedJobs: JobResponse[] = [
        // Add expected jobs for the custom parameters
      ];

      // Act
      jobService
        .getJobs(pageSize, pageIndex, sortField, sortOrder)
        .subscribe((jobs) => {
          // Assert
          expect(jobs).toEqual(expectedJobs);
        });

      // Assert
      const req = httpTestingController.expectOne(
        `/jobs?pageNumber=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
      );
      expect(req.request.method).toBe('GET');
      req.flush(expectedJobs);
    });
  });

  describe('getJobById', () => {
    it('should return a single JobResponse object', () => {
      const jobId = 1;
      const mockResponse: JobResponse = {
        id: 1,
        jobTitle: 'Software Engineer',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobStatus: 'Open',
        requirements: 'Job Requirements',
        jobDescription: null,
      };

      jobService.getJobById(jobId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`/jobs/${jobId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('postJob', () => {
    it('should return the created JobResponse object', () => {
      const jobPosition: JobResponse = {
        id: 1,
        jobTitle: 'Software Engineer',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobStatus: 'Open',
        requirements: 'Job Requirements',
        jobDescription: null,
      };
      const mockResponse: JobResponse = {
        id: 1,
        jobTitle: 'Software Engineer',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobStatus: 'Open',
        requirements: 'Job Requirements',
        jobDescription: null,
      };

      jobService.postJob(jobPosition).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`/jobs/`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(jobPosition);
      req.flush(mockResponse);
    });
  });

  describe('getTotalJobCount', () => {
    it('should return the total job count as a number', () => {
      const mockResponse = 100;

      jobService.getTotalJobCount().subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`/jobs/count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return a default value of 0 in case of an error', () => {
      const mockErrorResponse = {
        status: 500,
        statusText: 'Internal Server Error',
      };

      jobService.getTotalJobCount().subscribe(
        (res) => {
          expect(res).toBe(0);
        },
        (error) => {
          // Handle the error if needed
        }
      );

      const req = httpTestingController.expectOne(`/jobs/count`);
      expect(req.request.method).toBe('GET');
      req.flush(null, mockErrorResponse);
    });
  });

  describe('getCandidateCountByJob', () => {
    it('should return the candidate count for a specific job as a number', () => {
      const jobId = 1;
      const mockResponse = 10;

      jobService.getCandidateCountByJob(jobId).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const req = httpTestingController.expectOne(`/candidates/${jobId}/count`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return a default value of 0 in case of an error', () => {
      const jobId = 1;
      const mockErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      jobService.getCandidateCountByJob(jobId).subscribe((res) => {
        expect(res).toBe(0);
      });

      const req = httpTestingController.expectOne(`/candidates/${jobId}/count`);
      expect(req.request.method).toBe('GET');
      req.flush(null, mockErrorResponse);
    });
  });

  describe('updateJob', () => {
    it('should return the updated JobResponse object', () => {
      const jobId = 1;
      const jobPosition: JobResponse = {
        id: 1,
        jobTitle: 'Software Engineer',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobStatus: 'Open',
        requirements: 'Job Requirements',
        jobDescription: null,
      };
      const mockResponse: JobResponse = {
        id: 1,
        jobTitle: 'Software Engineer',
        hiringManagers: ['John Doe', 'Jane Smith'],
        requirements: 'Job Requirements',
        jobStatus: 'Open',
        jobDescription: null,
      };

      jobService.updateJob(jobId, jobPosition).subscribe((res) => {
        expect(res).toEqual(mockResponse);
      });

      const url = `/jobs/${jobId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(jobPosition);
      req.flush(mockResponse);
    });

    it('should throw an error in case of an HTTP error response', () => {
      const jobId = 1;
      const jobPosition: JobResponse = {
        id: 1,
        jobTitle: 'Software Engineer',
        hiringManagers: ['John Doe', 'Jane Smith'],
        jobStatus: 'Open',
        requirements: 'Job Requirements',
        jobDescription: null,
      };
      const mockErrorResponse = new HttpErrorResponse({
        status: 500,
        statusText: 'Internal Server Error',
      });

      jobService.updateJob(jobId, jobPosition).subscribe(
        () => {
          // Expecting an error to be thrown, so this block should not be executed
          fail('Expected error but got success response');
        },
        (error: HttpErrorResponse) => {
          expect(error.url).toBe(`/jobs/${jobId}`);
          expect(error.message).toBe(
            'Http failure response for /jobs/1: 500 Internal Server Error'
          );
        }
      );

      const url = `/jobs/${jobId}`;
      const req = httpTestingController.expectOne(url);
      expect(req.request.method).toBe('PUT');
      req.flush(null, mockErrorResponse);
    });
  });

  describe('deleteJobPosition', () => {
    it('should delete a job position', () => {
      jobService.deleteJobPosition(1).subscribe((response) => {
        expect(response).toBeNull();
      });

      const req = httpTestingController.expectOne('/jobs/1');
      expect(req.request.method).toBe('DELETE');
      req.flush(null);
    });
  });
});
