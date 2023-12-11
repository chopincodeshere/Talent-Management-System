import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchCandidateComponent } from './search-candidate.component';
import { HttpErrorResponse } from '@angular/common/http';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SortDirection } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { ActivatedRoute, Params } from '@angular/router';
import { CandidateDataService } from 'src/app/shared/services/candidate-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SearchComponent', () => {
  let component: SearchCandidateComponent;
  let candidateService: CandidateService;
  let candidateDataService: CandidateDataService;
  let snackBar: MatSnackBar;
  let fixture: ComponentFixture<SearchCandidateComponent>;
  let liveAnnouncerSpy: jasmine.SpyObj<LiveAnnouncer>;
  let route: ActivatedRoute;
  let mockCandidates: CandidateResponse[] = [
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
      totalExperience: '5',
      source: 'LinkedIn',
      skills: ['Java', 'Spring', 'Angular'],
      enrolledDate: new Date(),
      candidateCode: '',
      mayKnowSkills: ['Java', 'Spring', 'Angular'],
      mobilePhone: '1234567890',
      currentNoticePeriod: '1 month',
      education: {
        highestDegree: 'Bachelor',
        specialization: 'Computer Science',
        yearOfAchievement: new Date(),
      },
      workMode: 'Remote',
      round: 1,
    },
  ];

  beforeEach(async () => {
    liveAnnouncerSpy = jasmine.createSpyObj<LiveAnnouncer>(['announce']);

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        SearchModule,
      ],
      declarations: [SearchCandidateComponent],
      providers: [
        CandidateService,
        CandidateDataService,
        MatSnackBar,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
            queryParams: of({}),
            snapshot: {
              queryParams: {},
            },
          },
        },
        { provide: LiveAnnouncer, useValue: liveAnnouncerSpy },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchCandidateComponent);
    component = fixture.componentInstance;

    candidateService = TestBed.inject(CandidateService);
    candidateDataService = TestBed.inject(CandidateDataService);
    snackBar = TestBed.inject(MatSnackBar);
    route = jasmine.createSpyObj('ActivatedRoute', ['snapshot', 'queryParams']);

    // Set the mock route in the component
    (component as any).route = route;

    // Initialize the dataSource property with mock data
    component.dataSource = new MatTableDataSource(mockCandidates);

    fixture.detectChanges();
    component.ngOnInit();

    component.selection = new SelectionModel<CandidateResponse>(true, []);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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

  describe('announceSort', () => {
    it('should announce sort direction and call fetchCandidates when sortState direction is truthy', () => {
      const sortState = {
        active: 'firstName',
        direction: 'asc' as SortDirection,
      };
      component.fetchCandidates = jasmine.createSpy('fetchCandidates');

      component.announceSortChange(sortState);

      expect(liveAnnouncerSpy.announce).toHaveBeenCalledWith(
        'Sorted ascending'
      );
      expect(component.fetchCandidates).toHaveBeenCalledWith(
        'firstName',
        'asc'
      );
    });

    it('should announce sorting cleared when sortState direction is falsy', () => {
      const sortState = { active: 'firstName', direction: '' as SortDirection };

      component.announceSortChange(sortState);

      expect(liveAnnouncerSpy.announce).toHaveBeenCalledWith('Sorting cleared');
    });
  });

  describe('onPageChange', () => {
    it('should update pageIndex and pageSize and call fetchCandidates', () => {
      const event = { pageIndex: 1, pageSize: 10, length: 100 };
      spyOn(component, 'fetchCandidates');
      component.onPageChange(event);
      expect(component.pageIndex).toEqual(event.pageIndex);
      expect(component.pageSize).toEqual(event.pageSize);
      expect(component.fetchCandidates).toHaveBeenCalled();
    });
  });

  describe('checkboxLabel', () => {
    it('should return "select all" if row is not provided and not all rows are selected', () => {
      spyOn(component, 'isAllSelected').and.returnValue(false);
      expect(component.checkboxLabel()).toEqual('select all');
    });

    it('should return "deselect all" if row is not provided and all rows are selected', () => {
      spyOn(component, 'isAllSelected').and.returnValue(true);
      expect(component.checkboxLabel()).toEqual('deselect all');
    });

    it('should return "select row X" if row is provided and row is not selected', () => {
      spyOn(component.selection, 'isSelected').and.returnValue(false);
      expect(component.checkboxLabel(mockCandidates[0])).toEqual(
        'select row 2'
      );
    });

    it('should return "deselect row X" if row is provided and row is selected', () => {
      spyOn(component.selection, 'isSelected').and.returnValue(true);
      expect(component.checkboxLabel(mockCandidates[0])).toEqual(
        'deselect row 2'
      );
    });
  });

  describe('deleteCandidate', () => {
    it('should delete selected candidates and clear selection', () => {
      // Arrange
      const selectedRows = [
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
          currentNoticePeriod: '1 month',
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
          firstName: 'Kaley',
          lastName: 'Howe',
          email: 'Kale@email.com',
          jobPosition: {
            jobTitle: 'Java Software Engineer (OP)',
            hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
            jobStatus: 'open',
          },
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
          currentNoticePeriod: '1 month',
          education: {
            highestDegree: 'Bachelor',
            specialization: 'Engineering',
            yearOfAchievement: new Date('2021-09-24'),
          },
          workMode: 'Remote',
          round: 1,
        },
      ];

      const deleteCandidateSpy = spyOn(
        candidateService,
        'deleteCandidate'
      ).and.returnValue(of({} as unknown as void));

      // Set selection and data source
      component.selection = new SelectionModel<CandidateResponse>(
        true,
        selectedRows
      );
      component.dataSource = new MatTableDataSource<CandidateResponse>(
        selectedRows
      ); // Initialize the dataSource
      component.dataSource.data = selectedRows;

      // Act
      component.deleteCandidates();

      // Assert
      expect(deleteCandidateSpy).toHaveBeenCalledTimes(selectedRows.length);
      expect(component.dataSource.data).toEqual([]);
      expect(component.selection.selected).toEqual([]);
    });

    it('should handle deletion error and display alert', () => {
      // Arrange
      const selectedRow = {
        id: 201,
        firstName: 'Kaley',
        lastName: 'Howe',
        email: 'Kale@email.com',
        jobPosition: {
          jobTitle: 'Java Software Engineer (OP)',
          hiringManager: ['Jaydeep Chhasatia', 'Ankur Gupta', 'Mickeal A.'],
          jobStatus: 'open',
        },
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
        currentNoticePeriod: '1 month',
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
      };

      const deleteCandidateSpy = spyOn(
        candidateService,
        'deleteCandidate'
      ).and.returnValue(throwError(new HttpErrorResponse({})));

      // Set selection and data source
      component.selection = new SelectionModel<CandidateResponse>(true, [
        selectedRow,
      ]);
      component.dataSource = new MatTableDataSource<CandidateResponse>([
        selectedRow,
      ]); // Initialize the dataSource
      component.dataSource.data = [selectedRow];

      // Spy on the alert function
      spyOn(snackBar, 'open');

      // Act
      component.deleteCandidates();

      // Assert
      expect(deleteCandidateSpy).toHaveBeenCalledTimes(1);
      expect(component.dataSource.data).toEqual([selectedRow]);
      expect(snackBar.open).toHaveBeenCalled();
    });
  });
});
