import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { CandidateService } from './candidate.service';
import { Observable, catchError, of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { Candidate } from 'src/app/core/models/candidate';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { HttpTestingController } from '@angular/common/http/testing';
import { CandidateFeedback } from 'src/app/core/models/CandidateFeedback';
import { Page } from 'src/app/core/models/page';

describe('CandidateService', () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let candidateService: CandidateService;

  beforeEach(() => {
    let httpClientSpyObj = jasmine.createSpyObj('HttpClient', [
      'get',
      'post',
      'put',
      'delete',
    ]);
    TestBed.configureTestingModule({
      providers: [
        CandidateService,
        {
          provide: HttpClient,
          useValue: httpClientSpyObj,
        },
      ],
    });
    candidateService = TestBed.inject(CandidateService);

    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  describe('getTotalNumberOfRecords', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const expectedCount = 10;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCount));

      // Call the getTotalNumberOfRecords method
      const result: Observable<number> =
        candidateService.getTotalNumberOfRecords();

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `candidates/count`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((count: number) => {
        expect(count).toBe(expectedCount);
      });
    });
  });

  describe('getNumberOfShortlistedCandidates', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const expectedCount = 5;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCount));

      // Call the getNumberOfShortlistedCandidates method
      const result: Observable<number> =
        candidateService.getNumberOfShortlistedCandidates();

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `candidates/count/shortlisted`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((count: number) => {
        expect(count).toBe(expectedCount);
      });
    });
  });

  describe('getNumberOfHiredCandidates', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const expectedCount = 5;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCount));

      // Call the getNumberOfShortlistedCandidates method
      const result: Observable<number> =
        candidateService.getNumberOfHiredCandidates();

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `candidates/count/hired`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((count: number) => {
        expect(count).toBe(expectedCount);
      });
    });
  });

  describe('getNumberOfOnHoldCandidates', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const expectedCount = 5;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCount));

      // Call the getNumberOfShortlistedCandidates method
      const result: Observable<number> =
        candidateService.getNumberOfOnHoldCandidates();

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `candidates/count/on-hold`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((count: number) => {
        expect(count).toBe(expectedCount);
      });
    });
  });

  describe('getNumberOfRejectedCandidates', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const expectedCount = 5;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCount));

      // Call the getNumberOfShortlistedCandidates method
      const result: Observable<number> =
        candidateService.getNumberOfRejectedCandidates();

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `candidates/count/rejected`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((count: number) => {
        expect(count).toBe(expectedCount);
      });
    });
  });

  describe('getNumberOfInactiveCandidates', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const expectedCount = 5;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCount));

      // Call the getNumberOfShortlistedCandidates method
      const result: Observable<number> =
        candidateService.getNumberOfInactiveCandidates();

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `candidates/count/inactive`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((count: number) => {
        expect(count).toBe(expectedCount);
      });
    });
  });

  describe('getCandidates', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should return an empty array when the server returns an error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });

      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      candidateService
        .getCandidates(1, 10, 'name', 'asc')
        .subscribe((candidates) => expect(candidates).toEqual([]), fail);
    });

    it('should return an array of candidates when the server returns a successful response', () => {
      const mockCandidates: CandidateResponse[] = [
        {
          id: 201,
          firstName: 'Kaley',
          lastName: 'Howe',
          email: 'Kale@email.com',
          jobPosition: {
            jobTitle: 'Java Software Engineer (OP)',
            hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
            jobStatus: 'open',
          },
          currentNoticePeriod: '1month',
          address: {
            currentAddress: {
              currentCountry: 'India',
              currentState: 'Tamil Nadu',
              currentCity: 'Chennai',
            },
            permanentAddress: {
              permanentCountry: 'India',
              permanentState: 'Gujarat',
              permanentCity: 'Vadodara',
            },
          },
          currentCTC: '12',
          expectedCTC: '13',
          totalExperience: '3',
          source: 'Newspaper',
          skills: ['Python', 'R', 'MongoDB', 'PHP'],
          enrolledDate: new Date('2021-09-24'),
          candidateCode: '',
          mayKnowSkills: ['Python', 'R', 'MongoDB', 'PHP'],
          mobilePhone: '9999999999',
          education: {
            highestDegree: 'Bachelor',
            specialization: 'Engineering',
            yearOfAchievement: new Date('2021-09-24'),
          },
          workMode: 'Remote',
          round: 1,
        },
      ];

      httpClientSpy.get.and.returnValue(of(mockCandidates));

      candidateService
        .getCandidates(1, 10, 'firstName', 'asc')
        .subscribe(
          (candidates) => expect(candidates).toEqual(mockCandidates),
          fail
        );
    });

    it('should call the handleError function when the server returns an error', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });

      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      spyOn(candidateService, 'handleError').and.callThrough();

      candidateService
        .getCandidates(1, 10, 'name', 'asc')
        .subscribe((candidates) => expect(candidates).toEqual([]), fail);

      expect(candidateService.handleError).toHaveBeenCalled();
    });
  });

  describe('addCandidate()', () => {
    it('should add the candidate', (done: DoneFn) => {
      const candidate: Candidate = {
        id: 260107,
        firstName: 'Kaley',
        lastName: 'Howe',
        email: 'Phoebe99@yahoo.com',
        address: {
          currentAddress: {
            currentCountry: 'Nicaragua',
            currentState: 'Iowa',
            currentCity: 'Fort Godfreyville',
          },
          permanentAddress: {
            permanentCountry: 'Chile',
            permanentState: 'Oregon',
            permanentCity: 'South Kavonview',
          },
        },
        mobilePhone: '9876543210',
        links: ['Architect', 'Jersey', 'open'],
        employment: [
          {
            companyName: 'Runolfsdottir Inc',
            designation: 'Direct Implementation Administrator',
            previousCTC: '5',
            location: 'Kyleeland',
            workingStatus: 'Working',
            start: new Date('2017-01-29'),
            finish: new Date('2018-07-21'),
          },
          {
            companyName: 'Skiles, Grady and Balistreri',
            designation: 'National Division Administrator',
            previousCTC: '3',
            location: 'North Lottie',
            workingStatus: 'Working',
            start: new Date('2019-11-14'),
            finish: new Date('2018-10-03'),
          },
        ],
        education: {
          highestDegree: 'Master of Engineering',
          specialization: 'who',
          yearOfAchievement: new Date('2021-09-24'),
        },
        source: 'Newspaper',
        note: 'Sunt non incidunt sapiente eos magnam rerum beatae.',
        referral: {
          referred_fname: 'Phoebe',
          referred_lname: 'Schinner',
        },
        resume: new File(['fileContent'], 'sample.pdf', {
          type: 'application/pdf',
        }),
        keySkills: ['Python', 'R', 'MongoDB', 'PHP'],
        mayKnowSkills: ['C', 'C', 'C', 'HTML'],
        totalExperience: '14',
        currentCTC: '7',
        expectedCTC: '1',
        currentNoticePeriod: '1 days',
        job_id: 1,
        stage: 'Interviewing',
        workMode: 'Remote',
        communicationSkills: '5',
      };
      httpClientSpy.post.and.returnValue(of(candidate));
      candidateService.addCandidate(candidate).subscribe({
        next: (response) => {
          expect(response).toEqual(candidate);
          done();
        },
        error: () => {
          done.fail();
        },
      });
      expect(httpClientSpy.post).toHaveBeenCalledTimes(1);
    });
  });

  describe('updateCandidate()', () => {
    it('should update the candidate', (done: DoneFn) => {
      const candidate: Candidate = {
        id: 260107,
        firstName: 'Kaley',
        lastName: 'Howe',
        email: 'Phoebe99@yahoo.com',
        address: {
          currentAddress: {
            currentCountry: 'Nicaragua',
            currentState: 'Iowa',
            currentCity: 'Fort Godfreyville',
          },
          permanentAddress: {
            permanentCountry: 'Chile',
            permanentState: 'Oregon',
            permanentCity: 'South Kavonview',
          },
        },
        mobilePhone: '9876543210',
        links: ['Architect', 'Jersey', 'open'],
        employment: [
          {
            companyName: 'Runolfsdottir Inc',
            designation: 'Direct Implementation Administrator',
            previousCTC: '5',
            location: 'Kyleeland',
            workingStatus: 'Working',
            start: new Date('2017-01-29'),
            finish: new Date('2018-07-21'),
          },
          {
            companyName: 'Skiles, Grady and Balistreri',
            designation: 'National Division Administrator',
            previousCTC: '3',
            location: 'North Lottie',
            workingStatus: 'Working',
            start: new Date('2019-11-14'),
            finish: new Date('2018-10-03'),
          },
        ],
        education: {
          highestDegree: 'Master of Engineering',
          specialization: 'who',
          yearOfAchievement: new Date('2021-09-24'),
        },
        source: 'Newspaper',
        note: 'Sunt non incidunt sapiente eos magnam rerum beatae.',
        referral: {
          referred_fname: 'Phoebe',
          referred_lname: 'Schinner',
        },
        resume: new File(['fileContent'], 'sample.pdf', {
          type: 'application/pdf',
        }),
        keySkills: ['Python', 'R', 'MongoDB', 'PHP'],
        mayKnowSkills: ['C', 'C', 'C', 'HTML'],
        totalExperience: '14',
        currentCTC: '7',
        expectedCTC: '1',
        currentNoticePeriod: '1 days',
        job_id: 2,
        stage: 'Interviewing',
        workMode: 'Remote',
        communicationSkills: '5',
      };
      httpClientSpy.put.and.returnValue(of(candidate));
      candidateService.updateCandidate(candidate, 260107).subscribe({
        next: (response) => {
          expect(response).toEqual(candidate);
          done();
        },
        error: () => {
          done.fail();
        },
      });
      expect(httpClientSpy.put).toHaveBeenCalledTimes(1);
    });
  });

  describe('deleteCandidate()', () => {
    it('should delete a candidate', (done: DoneFn) => {
      const candidateId = 1;
      httpClientSpy.delete.and.returnValue(of(null));
      candidateService.deleteCandidate(candidateId).subscribe({
        next: () => {
          expect().nothing();
          done();
        },
        error: () => {
          done.fail();
        },
      });
      expect(httpClientSpy.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('getCandidatesById', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should return an empty array when the server returns an error', () => {
      const candidateId = 1;

      // Set up the HttpClient spy to return an error response
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });
      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      // Call the getCandidateById method
      const result: Observable<Candidate> =
        candidateService.getCandidateById(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        `/candidates/${candidateId}`
      );

      // Subscribe to the result and assert that an error occurred and the result is undefined
      result.subscribe(
        () => {
          // This block should not be executed since an error is expected
          fail('Expected error but got result');
        },
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(404);
          expect(error.statusText).toEqual('Not Found');
        }
      );
    });

    it('should return a candidate with the specified ID', () => {
      const candidateId = 1;
      const expectedCandidate: Candidate = {
        id: candidateId,
        firstName: 'Kaley',
        lastName: 'Howe',
        email: 'Kale@email.com',
        links: ['Architect', 'Jersey', 'open'],
        note: 'Sunt non incidunt sapiente eos magnam rerum beatae.',
        referral: {
          referred_fname: 'Phoebe',
          referred_lname: 'Schinner',
        },
        resume: new File(['fileContent'], 'sample.pdf', {
          type: 'application/pdf',
        }),
        employment: [
          {
            companyName: 'Runolfsdottir Inc',
            designation: 'Direct Implementation Administrator',
            previousCTC: '5',
            location: 'Kyleeland',
            workingStatus: 'Working',
            start: new Date('2017-01-29'),
            finish: new Date('2018-07-21'),
          },
          {
            companyName: 'Skiles, Grady and Balistreri',
            designation: 'National Division Administrator',
            previousCTC: '3',
            location: 'North Lottie',
            workingStatus: 'Working',
            start: new Date('2019-11-14'),
            finish: new Date('2018-10-03'),
          },
        ],
        job_id: 2,
        stage: 'Inactive',
        currentNoticePeriod: '1month',
        address: {
          currentAddress: {
            currentCountry: 'India',
            currentState: 'Tamil Nadu',
            currentCity: 'Chennai',
          },
          permanentAddress: {
            permanentCountry: 'India',
            permanentState: 'Gujarat',
            permanentCity: 'Vadodara',
          },
        },
        currentCTC: '12',
        expectedCTC: '13',
        totalExperience: '3',
        communicationSkills: '5',
        source: 'Newspaper',
        keySkills: ['Python', 'R', 'MongoDB', 'PHP'],
        mayKnowSkills: ['Python', 'R', 'MongoDB', 'PHP'],
        mobilePhone: '9999999999',
        education: {
          highestDegree: 'Bachelor',
          specialization: 'Engineering',
          yearOfAchievement: new Date('2021-09-24'),
        },
        workMode: 'Remote',
        round: 1,
      };

      // Set up the HttpClient spy to return a mock response
      httpClientSpy.get.and.returnValue(of(expectedCandidate));

      // Call the getCandidateById method
      const result: Observable<Candidate> =
        candidateService.getCandidateById(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        `/candidates/${candidateId}`
      );

      // Subscribe to the result and assert the returned candidate
      result.subscribe((candidate: Candidate) => {
        expect(candidate).toEqual(expectedCandidate);
      });
    });
  });

  describe('addInterviewerNote', () => {
    let httpClientSpy: { put: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a PUT request to add interviewer note', () => {
      const note = 'Test note';
      const candidateId = 1;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.put.and.returnValue(of({}));

      // Call the addInterviewerNote method
      const result: Observable<any> = candidateService.addInterviewerNote(
        note,
        candidateId
      );

      // Verify that the HttpClient put method was called with the correct URL and body
      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `/candidates/${candidateId}/note`,
        note
      );

      // Subscribe to the result and assert that no error occurred
      result.subscribe(
        () => {
          expect(true).toBe(true);
        },
        (error: any) => {
          fail(`Expected no error but got ${error}`);
        }
      );
    });

    it('should propagate the error if the server returns an error', () => {
      const note = 'Test note';
      const candidateId = 1;

      // Set up the HttpClient spy to return an error response
      const errorResponse = new HttpErrorResponse({
        error: 'test error',
        status: 500,
        statusText: 'Internal Server Error',
      });
      httpClientSpy.put.and.returnValue(throwError(errorResponse));

      // Call the addInterviewerNote method
      const result: Observable<any> = candidateService.addInterviewerNote(
        note,
        candidateId
      );

      // Verify that the HttpClient put method was called with the correct URL and body
      expect(httpClientSpy.put).toHaveBeenCalledWith(
        `/candidates/${candidateId}/note`,
        note
      );

      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: HttpErrorResponse) => {
          expect(error.status).toEqual(500);
          expect(error.statusText).toEqual('Internal Server Error');
        }
      );
    });
  });

  describe('getCandidateByJobAndFilters', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;
  
    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });
  
    it('should make a GET request with the correct URL', () => {
      const jobId = 1;
      const params = new URLSearchParams();
      params.set('filter1', 'value1');
      params.set('filter2', 'value2');
      const pageIndex = 0;
      const pageSize = 10;
      const sortField = 'name';
      const sortDirection = 'asc';
  
      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of([]));
  
      // Call the getCandidateByJobAndFilters method
      const result: Observable<CandidateResponse[]> = candidateService.getCandidateByJobAndFilters(
        jobId,
        params,
        pageIndex,
        pageSize,
        sortField,
        sortDirection
      );
  
      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/${jobId}/filter?${params.toString()}&pageIndex=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
  
      // Subscribe to the result and assert that the response is an empty array
      result.subscribe((candidates: CandidateResponse[]) => {
        expect(candidates).toEqual([]);
      });
    });
  
    it('should handle an error response', () => {
      const jobId = 1;
      const params = new URLSearchParams();
      params.set('filter1', 'value1');
      params.set('filter2', 'value2');
      const pageIndex = 0;
      const pageSize = 10;
      const sortField = 'name';
      const sortDirection = 'asc';
  
      // Set up the HttpClient spy to return an error response
      const errorResponse = new Error('Test error');
      httpClientSpy.get.and.returnValue(throwError(errorResponse));
  
      // Call the getCandidateByJobAndFilters method
      const result: Observable<CandidateResponse[]> = candidateService.getCandidateByJobAndFilters(
        jobId,
        params,
        pageIndex,
        pageSize,
        sortField,
        sortDirection
      );
  
      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/${jobId}/filter?${params.toString()}&pageIndex=${pageIndex}&pageSize=${pageSize}&sortField=${sortField}&sortDirection=${sortDirection}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
  
      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: Error) => {
          expect(error).toBe(errorResponse);
        }
      );
    });
  });
  

  describe('getCandidatesByJobPosition', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and handle success response', () => {
      const jobId = 1;
      const pageNumber = 1;
      const pageSize = 10;
      const sortField = 'asc';
      const sortOrder = 'name';

      // Set up the HttpClient spy to return a successful response
      const expectedResponse: CandidateResponse[] = [];
      httpClientSpy.get.and.returnValue(of(expectedResponse));

      // Call the getCandidatesByJobPosition method
      const result: Observable<CandidateResponse[]> =
        candidateService.getCandidatesByJobPosition(
          jobId,
          pageNumber,
          pageSize,
          sortField,
          sortOrder
        );

      // Verify that the HttpClient get method was called with the correct URL
      expect(httpClientSpy.get).toHaveBeenCalledWith(
        `/candidates/job/${jobId}?&pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`
      );

      // Subscribe to the result and assert that the response is as expected
      result.subscribe((candidates: CandidateResponse[]) => {
        expect(candidates).toEqual(expectedResponse);
      });
    });
  });

  describe('getCandidateByJobAndKeywords', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;
  
    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });
  
    it('should make a GET request with the correct URL', () => {
      const jobId = 1;
      const keywords = ['keyword1', 'keyword2'];
      const pageIndex = 0;
      const pageSize = 10;
  
      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of([]));
  
      // Call the getCandidateByJobAndKeywords method
      const result: Observable<CandidateResponse[]> = candidateService.getCandidateByJobAndKeywords(
        jobId,
        keywords,
        pageIndex,
        pageSize
      );
  
      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/search/${jobId}?keywords=keyword1,keyword2&pageIndex=${pageIndex}&pageSize=${pageSize}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
  
      // Subscribe to the result and assert that the response is an empty array
      result.subscribe((candidates: CandidateResponse[]) => {
        expect(candidates).toEqual([]);
      });
    });
  
    it('should handle an error response', () => {
      const jobId = 1;
      const keywords = ['keyword1', 'keyword2'];
      const pageIndex = 0;
      const pageSize = 10;
  
      // Set up the HttpClient spy to return an error response
      const errorResponse = new Error('Test error');
      httpClientSpy.get.and.returnValue(throwError(errorResponse));
  
      // Call the getCandidateByJobAndKeywords method
      const result: Observable<CandidateResponse[]> = candidateService.getCandidateByJobAndKeywords(
        jobId,
        keywords,
        pageIndex,
        pageSize
      );
  
      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/search/${jobId}?keywords=keyword1,keyword2&pageIndex=${pageIndex}&pageSize=${pageSize}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);
  
      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: Error) => {
          expect(error).toBe(errorResponse);
        }
      );
    });
  });
  

  describe('getCandidateName', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const candidateId = 1;

      // Set up the HttpClient spy to return a successful response
      const response = 'John Doe';
      httpClientSpy.get.and.returnValue(of(response));

      // Call the getCandidateName method
      const result: Observable<string> =
        candidateService.getCandidateName(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/name/${candidateId}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl, {
        responseType: 'text',
      });

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((name: string) => {
        expect(name).toBe(response.trim());
      });
    });

    it('should handle an error response', () => {
      const candidateId = 1;

      // Set up the HttpClient spy to return an error response
      const errorResponse = new Error('Test error');
      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      // Call the getCandidateName method
      const result: Observable<string> =
        candidateService.getCandidateName(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/name/${candidateId}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl, {
        responseType: 'text',
      });

      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: Error) => {
          expect(error).toBe(errorResponse);
        }
      );
    });
  });

  describe('getCandidatePosition', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and return the response', () => {
      const candidateId = 1;

      // Set up the HttpClient spy to return a successful response
      const response = 2;
      httpClientSpy.get.and.returnValue(of(response));

      // Call the getCandidatePosition method
      const result: Observable<number> =
        candidateService.getCandidatePosition(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/position/${candidateId}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the response is returned
      result.subscribe((position: number) => {
        expect(position).toBe(response);
      });
    });

    it('should handle an error response', () => {
      const candidateId = 1;

      // Set up the HttpClient spy to return an error response
      const errorResponse = new Error('Test error');
      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      // Call the getCandidatePosition method
      const result: Observable<number> =
        candidateService.getCandidatePosition(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/position/${candidateId}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: Error) => {
          expect(error).toBe(errorResponse);
        }
      );
    });
  });

  describe('addCandidateFeedback', () => {
    let httpClientSpy: { post: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['post']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a POST request with the correct URL and data', () => {
      const candidateId = 1;

      const feedback = {
        candidateName: 'Jane Doe',
        dateOfInterview: new Date(),
        positionAppliedFor: 2,
        interviewer: 'Interviewer',
        educationalBackgroundRating: 3,
        workExperienceRating: 5,
        technicalSkillsRating: 8,
        communicationSkillsRating: 7,
        candidateInterestRating: 9,
        interpersonalSkillsRating: 7,
        overallRating: 4.3,
        comments: 'Feedback comments',
        result: 'Accepted',
      };

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.post.and.returnValue(of(feedback));

      // Call the addCandidateFeedback method
      const result: Observable<CandidateFeedback> =
        candidateService.addCandidateFeedback(candidateId, feedback);

      // Verify that the HttpClient post method was called with the correct URL and data
      const expectedUrl = `/candidates/${candidateId}/feedback/add`;
      expect(httpClientSpy.post).toHaveBeenCalledWith(expectedUrl, feedback);

      // Subscribe to the result and assert that the response is returned
      result.subscribe((resultFeedback: CandidateFeedback) => {
        expect(resultFeedback).toBe(feedback);
      });
    });

    it('should handle an error response', () => {
      const candidateId = 1;
      const feedback = {
        candidateName: 'Jane Doe',
        dateOfInterview: new Date(),
        positionAppliedFor: 2,
        interviewer: 'Interviewer',
        educationalBackgroundRating: 3,
        workExperienceRating: 5,
        technicalSkillsRating: 8,
        communicationSkillsRating: 7,
        candidateInterestRating: 9,
        interpersonalSkillsRating: 7,
        overallRating: 4.3,
        comments: 'Feedback comments',
        result: 'Accepted',
      };

      // Set up the HttpClient spy to return an error response
      const errorResponse = new Error('Test error');
      httpClientSpy.post.and.returnValue(throwError(errorResponse));

      // Call the addCandidateFeedback method
      const result: Observable<CandidateFeedback> =
        candidateService.addCandidateFeedback(candidateId, feedback);

      // Verify that the HttpClient post method was called with the correct URL and data
      const expectedUrl = `/candidates/${candidateId}/feedback/add`;
      expect(httpClientSpy.post).toHaveBeenCalledWith(expectedUrl, feedback);

      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: Error) => {
          expect(error).toBe(errorResponse);
        }
      );
    });
  });

  describe('getCandidateFeedback', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const candidateId = 1;

      // Set up the HttpClient spy to return a successful response
      const response = [
        {
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
        },
        {
          candidateName: 'Jane Doe',
          dateOfInterview: new Date(),
          positionAppliedFor: 2,
          interviewer: 'Interviewer',
          educationalBackgroundRating: 3,
          workExperienceRating: 5,
          technicalSkillsRating: 8,
          communicationSkillsRating: 7,
          candidateInterestRating: 9,
          interpersonalSkillsRating: 7,
          overallRating: 4.3,
          comments: 'Feedback comments',
          result: 'Accepted',
        },
      ];
      httpClientSpy.get.and.returnValue(of(response));

      // Call the getCandidateFeedback method
      const result: Observable<CandidateFeedback[]> =
        candidateService.getCandidateFeedback(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/candidateFeedback/${candidateId}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((feedback: CandidateFeedback[]) => {
        expect(feedback).toBe(response);
      });
    });

    it('should handle an error response', () => {
      const candidateId = 1;

      // Set up the HttpClient spy to return an error response
      const errorResponse = new Error('Test error');
      httpClientSpy.get.and.returnValue(throwError(errorResponse));

      // Call the getCandidateFeedback method
      const result: Observable<CandidateFeedback[]> =
        candidateService.getCandidateFeedback(candidateId);

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/candidateFeedback/${candidateId}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: Error) => {
          expect(error).toBe(errorResponse);
        }
      );
    });
  });

  describe('updateCandidateRound', () => {
    let httpClientSpy: { put: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a PUT request with the correct URL and data', () => {
      const candidateId = 1;
      const round = 2;

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.put.and.returnValue(of(null));

      // Call the updateCandidateRound method
      const result: Observable<any> = candidateService.updateCandidateRound(
        candidateId,
        round
      );

      // Verify that the HttpClient put method was called with the correct URL and data
      const expectedUrl = `/candidates/${candidateId}/round`;
      expect(httpClientSpy.put).toHaveBeenCalledWith(expectedUrl, round);

      // Subscribe to the result and assert that the response is returned
      result.subscribe((response: any) => {
        expect(response).toBeNull();
      });
    });

    it('should handle an error response', () => {
      const candidateId = 1;
      const round = 2;

      // Set up the HttpClient spy to return an error response
      const errorResponse = new Error('Test error');
      httpClientSpy.put.and.returnValue(throwError(errorResponse));

      // Call the updateCandidateRound method
      const result: Observable<any> = candidateService.updateCandidateRound(
        candidateId,
        round
      );

      // Verify that the HttpClient put method was called with the correct URL and data
      const expectedUrl = `/candidates/${candidateId}/round`;
      expect(httpClientSpy.put).toHaveBeenCalledWith(expectedUrl, round);

      // Subscribe to the result and assert that the error is propagated
      result.subscribe(
        () => {
          fail('Expected error but got result');
        },
        (error: Error) => {
          expect(error).toBe(errorResponse);
        }
      );
    });
  });

  describe('updateCandidateStage', () => {
    let httpClientSpy: { put: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['put']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a PUT request with the correct URL and data', () => {
      const candidateId = 1;
      const stage = 'interview';

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.put.and.returnValue(of(null));

      // Call the updateCandidateStage method
      const result: Observable<any> = candidateService.updateCandidateStage(
        candidateId,
        stage
      );

      // Verify that the HttpClient put method was called with the correct URL and data
      const expectedUrl = `/candidates/${candidateId}/stage`;
      expect(httpClientSpy.put).toHaveBeenCalledWith(expectedUrl, stage);

      // Subscribe to the result and assert that the response is returned
      result.subscribe((response: any) => {
        expect(response).toBeNull();
      });
    });
  });

  describe('getCandidatesWithStage', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const stage = 2;
      const pageNumber = 1;
      const pageSize = 10;
      const sortField = 'name';
      const sortOrder = 'asc';

      // Set up the HttpClient spy to return a successful response
      const response = [
        {
          id: 201,
          firstName: 'Kaley',
          lastName: 'Howe',
          email: 'Kale@email.com',
          jobPosition: {
            jobTitle: 'Java Software Engineer (OP)',
            hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
            jobStatus: 'open',
          },
          currentNoticePeriod: '1month',
          address: {
            currentAddress: {
              currentCountry: 'India',
              currentState: 'Tamil Nadu',
              currentCity: 'Chennai',
            },
            permanentAddress: {
              permanentCountry: 'India',
              permanentState: 'Gujarat',
              permanentCity: 'Vadodara',
            },
          },
          currentCTC: '12',
          expectedCTC: '13',
          totalExperience: '3',
          source: 'Newspaper',
          skills: ['Python', 'R', 'MongoDB', 'PHP'],
          enrolledDate: new Date('2021-09-24'),
          candidateCode: '',
          mayKnowSkills: ['Python', 'R', 'MongoDB', 'PHP'],
          mobilePhone: '9999999999',
          education: {
            highestDegree: 'Bachelor',
            specialization: 'Engineering',
            yearOfAchievement: new Date('2021-09-24'),
          },
          workMode: 'Remote',
          round: 1,
        },
        {
          id: 202,
          firstName: 'Paa',
          lastName: 'Khalifa',
          email: 'Kale@email.com',
          jobPosition: {
            jobTitle: 'Java Software Engineer (OP)',
            hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
            jobStatus: 'open',
          },
          currentNoticePeriod: '1month',
          address: {
            currentAddress: {
              currentCountry: 'India',
              currentState: 'Tamil Nadu',
              currentCity: 'Chennai',
            },
            permanentAddress: {
              permanentCountry: 'India',
              permanentState: 'Gujarat',
              permanentCity: 'Vadodara',
            },
          },
          currentCTC: '12',
          expectedCTC: '13',
          totalExperience: '3',
          source: 'Newspaper',
          skills: ['Python', 'R', 'MongoDB', 'PHP'],
          enrolledDate: new Date('2021-09-24'),
          candidateCode: '',
          mayKnowSkills: ['Python', 'R', 'MongoDB', 'PHP'],
          mobilePhone: '9999999999',
          education: {
            highestDegree: 'Bachelor',
            specialization: 'Engineering',
            yearOfAchievement: new Date('2021-09-24'),
          },
          workMode: 'Remote',
          round: 1,
        },
      ];
      httpClientSpy.get.and.returnValue(of(response));

      // Call the getCandidatesWithStage method
      const result: Observable<CandidateResponse[]> =
        candidateService.getCandidatesWithStage(
          stage,
          pageNumber,
          pageSize,
          sortField,
          sortOrder
        );

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/stage/${stage}?&pageNumber=${pageNumber}&pageSize=${pageSize}&sortField=${sortField}&sortOrder=${sortOrder}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((candidates: CandidateResponse[]) => {
        expect(candidates).toBe(response);
      });
    });
  });


  describe('getCandidatesWithStageAndKeywords', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const stage = 5;
      const keywords = ['java', 'angular'];
      const searchKeywords = keywords.join(',');
      const pageIndex = 0;
      const pageSize = 10;
      const expectedCandidates: CandidateResponse[] = [
        {
          id: 201,
          firstName: 'Kaley',
          lastName: 'Howe',
          email: 'Kale@email.com',
          jobPosition: {
            jobTitle: 'Java Software Engineer (OP)',
            hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
            jobStatus: 'open',
          },
          currentNoticePeriod: '1month',
          address: {
            currentAddress: {
              currentCountry: 'India',
              currentState: 'Tamil Nadu',
              currentCity: 'Chennai',
            },
            permanentAddress: {
              permanentCountry: 'India',
              permanentState: 'Gujarat',
              permanentCity: 'Vadodara',
            },
          },
          currentCTC: '12',
          expectedCTC: '13',
          totalExperience: '3',
          source: 'Newspaper',
          skills: ['Python', 'R', 'MongoDB', 'PHP'],
          enrolledDate: new Date('2021-09-24'),
          candidateCode: '',
          mayKnowSkills: ['Python', 'R', 'MongoDB', 'PHP'],
          mobilePhone: '9999999999',
          education: {
            highestDegree: 'Bachelor',
            specialization: 'Engineering',
            yearOfAchievement: new Date('2021-09-24'),
          },
          workMode: 'Remote',
          round: 1,
          stage: 'On Hold',
        },
      ];

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCandidates));

      // Call the getCandidatesWithStageAndKeywords method
      const result: Observable<CandidateResponse[]> =
        candidateService.getCandidatesWithStageAndKeywords(
          stage,
          keywords,
          pageIndex,
          pageSize
        );

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/search/stage/${stage}?keywords=${searchKeywords}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((candidates: CandidateResponse[]) => {
        expect(candidates).toEqual(expectedCandidates);
      });
    });
  });

  describe('getCandidatesWithStageAndFilters', () => {
    let httpClientSpy: { get: jasmine.Spy };
    let candidateService: CandidateService;

    beforeEach(() => {
      httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
      candidateService = new CandidateService(httpClientSpy as any);
    });

    it('should make a GET request with the correct URL and parse the response', () => {
      const stage = 5;
      const params = new URLSearchParams();
      params.set('location', 'New York');
      params.set('experience', '5+ years');
      const pageIndex = 1;
      const pageSize = 10;
      const expectedCandidatesPage: Page<CandidateResponse> = {
        content: [
          {
            id: 201,
            firstName: 'Kaley',
            lastName: 'Howe',
            email: 'Kale@email.com',
            jobPosition: {
              jobTitle: 'Java Software Engineer (OP)',
              hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
              jobStatus: 'open',
            },
            currentNoticePeriod: '1month',
            address: {
              currentAddress: {
                currentCountry: 'India',
                currentState: 'Tamil Nadu',
                currentCity: 'Chennai',
              },
              permanentAddress: {
                permanentCountry: 'India',
                permanentState: 'Gujarat',
                permanentCity: 'Vadodara',
              },
            },
            currentCTC: '12',
            expectedCTC: '13',
            totalExperience: '3',
            source: 'Newspaper',
            skills: ['Python', 'R', 'MongoDB', 'PHP'],
            enrolledDate: new Date('2021-09-24'),
            candidateCode: '',
            mayKnowSkills: ['Python', 'R', 'MongoDB', 'PHP'],
            mobilePhone: '9999999999',
            education: {
              highestDegree: 'Bachelor',
              specialization: 'Engineering',
              yearOfAchievement: new Date('2021-09-24'),
            },
            workMode: 'Remote',
            round: 1,
            stage: 'On Hold',
          },
        ],
        totalPages: 1,
        totalElements: 10,
        number: 1,
        size: 10,
      };

      // Set up the HttpClient spy to return a successful response
      httpClientSpy.get.and.returnValue(of(expectedCandidatesPage));

      // Call the getCandidatesWithStageAndFilters method
      const result: Observable<Page<CandidateResponse>> =
        candidateService.getCandidatesWithStageAndFilters(
          stage,
          pageIndex,
          pageSize,
          params
        );

      // Verify that the HttpClient get method was called with the correct URL
      const expectedUrl = `/candidates/filter/stage/${stage}?${params.toString()}&pageIndex=${pageIndex}&pageSize=${pageSize}`;
      expect(httpClientSpy.get).toHaveBeenCalledWith(expectedUrl);

      // Subscribe to the result and assert that the parsed response is returned
      result.subscribe((candidatesPage: Page<CandidateResponse>) => {
        expect(candidatesPage).toEqual(expectedCandidatesPage);
      });
    });
  });
});
