import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchComponent } from './search.component';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from '../../../material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let mockCandidates: CandidateResponse[];
  let candidateService: CandidateService;
  let route: ActivatedRoute;
  let router: Router;
  let snackBar: MatSnackBar;
  let http: HttpClient;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        BrowserAnimationsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
      ],
      declarations: [SearchComponent],
      providers: [CandidateService, MatSnackBar, Router],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    candidateService = TestBed.inject(CandidateService);
    router = TestBed.inject(Router);
    http = TestBed.inject(HttpClient);
    snackBar = TestBed.inject(MatSnackBar);

    component = fixture.componentInstance;

    mockCandidates = [
      {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@gmail.com',
        jobPosition: {
          jobTitle: 'Java Software Engineer (OP)',
          hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
          jobStatus: 'open',
        },
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
        currentNoticePeriod: '1 month',
        totalExperience: '5',
        source: 'LinkedIn',
        skills: ['Java', 'Spring', 'Angular'],
        enrolledDate: new Date(),
        candidateCode: '',
        mayKnowSkills: ['Java', 'Spring', 'Angular'],
        mobilePhone: '1234567890',
        education: {
          highestDegree: 'Bachelor',
          specialization: 'Computer Science',
          yearOfAchievement: new Date(),
        },
        workMode: 'Remote',
        round: 1,
      },
    ];

    route = jasmine.createSpyObj('ActivatedRoute', ['snapshot', 'queryParams']);
    // Mock the query parameters
    const queryParams: Params = {
      keywords: 'your-keywords',
    };
    route.queryParams = of(queryParams);

    // Set the mock route in the component
    (component as any).route = route;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchCities', () => {
    it('should return an array of unique cities from the candidates', () => {
      component.candidates = mockCandidates;
      const result = component.fetchCities();
      expect(result).toEqual(['San Francisco']);
    });
  });

  describe('fetchCandidates', () => {
    it('should call candidateService.getCandidates() with correct arguments', () => {
      spyOn(candidateService, 'getCandidates').and.returnValue(
        of([] as CandidateResponse[])
      );
      component.fetchCandidates('id', 'asc');
      expect(candidateService.getCandidates).toHaveBeenCalledWith(
        component.pageIndex,
        component.pageSize,
        'id',
        'asc'
      );
    });

    it('should set isLoading to true when fetching candidates', () => {
      spyOn(candidateService, 'getCandidates').and.returnValue(
        of([] as CandidateResponse[])
      );
      expect(component.isLoading).toBeTrue();
      component.fetchCandidates('id', 'asc');
    });

    it('should set isLoading to false when getCandidates returns an error', () => {
      spyOn(candidateService, 'getCandidates').and.returnValue(
        throwError(new HttpErrorResponse({}))
      );
      component.fetchCandidates('id', 'asc');
      expect(component.isLoading).toBeFalse();
    });
  });

  describe('fetchCandidatesByJob', () => {
    let mockDataSource: MatTableDataSource<CandidateResponse>;

    beforeEach(() => {
      component.isLoading = false;
      component.jobId = 3;

      spyOn(candidateService, 'getCandidatesByJobPosition').and.returnValue(
        of([] as CandidateResponse[])
      );

      // Create a mock instance of MatTableDataSource with type parameter CandidateResponse
      mockDataSource = new MatTableDataSource<CandidateResponse>([]);
      mockDataSource.data = [] as CandidateResponse[];

      // Assign the mockDataSource to the component's dataSource property
      component.dataSource = mockDataSource;

      // Call the fetchCandidatesByJob method
      component.fetchCandidatesByJob('id', 'asc');
    });

    it('should call candidateService.getCandidatesByJobPosition() with correct arguments', () => {
      expect(candidateService.getCandidatesByJobPosition).toHaveBeenCalledWith(
        component.jobId!,
        component.pageIndex,
        component.pageSize,
        'id',
        'asc'
      );
    });
  });

  describe('applySearch()', () => {
    it('should call getCandidateByJobAndKeywords and navigate when jobId is present', () => {
      // Arrange
      component.jobId = 123;
      component.keywords = ['keyword1', 'keyword2'];
      component.pageIndex = 1;
      component.pageSize = 10;
      spyOn((component as any).router, 'navigate');
      const getCandidateByJobAndKeywordsSpy = spyOn(candidateService, 'getCandidateByJobAndKeywords').and.returnValue(
        of(mockCandidates)
      );

      // Act
      component.applySearch();

      // Assert
      expect(getCandidateByJobAndKeywordsSpy).toHaveBeenCalledWith(
        123,
        ['keyword1', 'keyword2'],
        1,
        10
      );
      expect(component.dataSource.data).toEqual(mockCandidates);
      expect(component.length).toBe(mockCandidates.length);
      expect((component as any).candidateDataService.dataSource).toEqual(component.dataSource);
      expect((component as any).router.navigate).toHaveBeenCalledWith(
        [`interview/jobs/${component.jobId}/candidates/search`],
        { queryParams: { keywords: ['keyword1', 'keyword2'] } }
      );
    });

    it('should call getCandidatesWithStageAndKeywords and navigate when key is present', () => {
      // Arrange
      component.key = 1;
      component.keywords = ['keyword1', 'keyword2'];
      component.pageIndex = 1;
      component.pageSize = 10;
      spyOn((component as any).router, 'navigate');
      const getCandidatesWithStageAndKeywordsSpy = spyOn(candidateService, 'getCandidatesWithStageAndKeywords').and.returnValue(
        of(mockCandidates)
      );

      // Act
      component.applySearch();

      // Assert
      expect(getCandidatesWithStageAndKeywordsSpy).toHaveBeenCalledWith(
        1,
        ['keyword1', 'keyword2'],
        1,
        10
      );
      expect(component.dataSource.data).toEqual(mockCandidates);
      expect((component as any).candidateDataService.dataSource).toEqual(component.dataSource);
      expect((component as any).router.navigate).toHaveBeenCalledWith(
        [`/dashboard/${component.key}/search`],
        { queryParams: { keywords: ['keyword1', 'keyword2'] } }
      );
    });

    it('should call http.get and navigate when neither jobId nor key is present', () => {
      // Arrange
      component.keywords = ['keyword1', 'keyword2'];
      component.pageIndex = 1;
      component.pageSize = 10;
      spyOn((component as any).router, 'navigate');
      const httpGetSpy = spyOn(http, 'get').and.returnValue(
        of(mockCandidates)
      );

      // Act
      component.applySearch();

      // Assert
      expect(httpGetSpy).toHaveBeenCalledWith('/candidates/search?keywords=keyword1,keyword2');
      expect(component.dataSource.data).toEqual(mockCandidates);
      expect(component.length).toBe(mockCandidates.length);
      expect((component as any).candidateDataService.dataSource).toEqual(component.dataSource);
      expect((component as any).router.navigate).toHaveBeenCalledWith(
        ['/candidate-pool/all-candidates/search'],
        { queryParams: { keywords: 'keyword1,keyword2' } }
      );
    });

    it('should show snackbar with "Candidate not found" message when 404 error occurs', () => {
      // Arrange
      component.keywords = ['keyword1', 'keyword2'];
      component.pageIndex = 1;
      component.pageSize = 10;
      const errorResponse = new HttpErrorResponse({ status: 404 });
      spyOn(snackBar, 'open');
      spyOn(http, 'get').and.returnValue(throwError(errorResponse));

      // Act
      component.applySearch();

      // Assert
      expect(snackBar.open).toHaveBeenCalledWith('Candidate not found', 'Close', { duration: 2000 });
    });

    it('should show snackbar with "Error on server side" message when 500 error occurs', () => {
      // Arrange
      component.keywords = ['keyword1', 'keyword2'];
      component.pageIndex = 1;
      component.pageSize = 10;
      const errorResponse = new HttpErrorResponse({ status: 500 });
      spyOn(snackBar, 'open');
      spyOn(http, 'get').and.returnValue(throwError(errorResponse));

      // Act
      component.applySearch();

      // Assert
      expect(snackBar.open).toHaveBeenCalledWith('Error on server side', 'Close', { duration: 2000 });
    });

    it('should show snackbar with error message when other error occurs', () => {
      // Arrange
      component.keywords = ['keyword1', 'keyword2'];
      component.pageIndex = 1;
      component.pageSize = 10;
      const errorResponse = new HttpErrorResponse({ status: 400, error: { message: 'Bad Request' } });
      spyOn(snackBar, 'open');
      spyOn(http, 'get').and.returnValue(throwError(errorResponse));

      // Act
      component.applySearch();

      // Assert
      expect(snackBar.open).toHaveBeenCalledWith(`Failed to fetch candidates. Error code: 400`, 'Close', { duration: 2000 });
    });
  });
});
