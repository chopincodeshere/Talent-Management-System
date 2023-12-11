import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardJobStatusComponent } from './dashboard-job-status.component';
import { MatTableDataSource } from '@angular/material/table';
import { RouterTestingModule } from '@angular/router/testing';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
  MAT_DIALOG_SCROLL_STRATEGY,
  MatDialogConfig,
} from '@angular/material/dialog';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { SortDirection } from '@angular/material/sort';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { Candidate } from 'src/app/core/models/candidate';
import { EmailFormComponent } from 'src/app/modules/interview-feature/components/email-form/email-form.component';
import { MatSelectChange } from '@angular/material/select';

describe('DashboardJobStatusComponent', () => {
  let component: DashboardJobStatusComponent;
  let fixture: ComponentFixture<DashboardJobStatusComponent>;
  let candidateService: jasmine.SpyObj<CandidateService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let liveAnnouncerSpy: jasmine.SpyObj<LiveAnnouncer>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<EmailFormComponent>>;

  beforeEach(async () => {
    liveAnnouncerSpy = jasmine.createSpyObj<LiveAnnouncer>(['announce']);
    const candidateServiceSpy = jasmine.createSpyObj('CandidateService', [
      'getCandidatesWithStage',
      'getCandidates',
      'updateCandidate',
      'updateCandidateRound',
      'updateCandidateStage',
    ]);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    dialogSpy = jasmine.createSpyObj('MatDialog', ['open', 'close']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    (candidateServiceSpy.updateCandidate as jasmine.Spy).and.returnValue(
      of({})
    );
    (candidateServiceSpy.updateCandidateStage as jasmine.Spy).and.returnValue(
      of({})
    );
    (candidateServiceSpy.updateCandidateRound as jasmine.Spy).and.returnValue(
      of({})
    );

    await TestBed.configureTestingModule({
      imports: [
        MaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        SearchModule,
        MatPaginatorModule,
      ],
      declarations: [DashboardJobStatusComponent],
      providers: [
        Overlay,
        { provide: CandidateService, useValue: candidateServiceSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
        { provide: MatDialog, useValue: dialogSpy },
        {
          provide: MatDialogRef,
          useValue: jasmine.createSpyObj('MatDialogRef', ['open', 'close']),
        },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: LiveAnnouncer, useValue: liveAnnouncerSpy },
        {
          provide: MAT_DIALOG_SCROLL_STRATEGY,
          useFactory: (overlay: Overlay) => () =>
            overlay.scrollStrategies.block(),
          deps: [Overlay],
        },
        ScrollStrategyOptions,
      ],
    }).compileComponents();

    candidateService = TestBed.inject(
      CandidateService
    ) as jasmine.SpyObj<CandidateService>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture = TestBed.createComponent(DashboardJobStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('fetchCandidatesWithStage', () => {
    beforeEach(() => {
      component.key = 3;
      component.pageIndex = 0;
      component.pageSize = 10;
    });

    it('should fetch candidates with stage 3 and set the dataSource', () => {
      // Arrange
      const columnName = 'id';
      const sortDirection = 'asc';
      const mockResponse: CandidateResponse[] = [
        {
          id: 201,
          firstName: 'Kaley',
          lastName: 'Howe',
          email: 'Kale@email.com',
          stage: 'On Hold',
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
          round: 2,
        },
      ];
      candidateService.getCandidatesWithStage.and.returnValue(of(mockResponse));

      // Act
      component.fetchCandidatesWithStage(columnName, sortDirection);

      // Assert
      expect(candidateService.getCandidatesWithStage).toHaveBeenCalledWith(
        3,
        0,
        10,
        columnName,
        sortDirection
      );
      expect(component.candidates).toEqual(mockResponse);
      expect(component.dataSource).toBeInstanceOf(MatTableDataSource);
      expect(component.dataSource.data).toEqual(mockResponse);
      expect(snackBar.open).not.toHaveBeenCalled();
    });

    it('should handle error and show snackbar message', () => {
      // Arrange
      const columnName = 'id';
      const sortDirection = 'asc';
      const errorMessage = 'Failed to fetch candidates';
      candidateService.getCandidatesWithStage.and.returnValue(
        throwError(new HttpErrorResponse({ error: errorMessage }))
      );

      // Act
      component.fetchCandidatesWithStage(columnName, sortDirection);

      // Assert
      expect(candidateService.getCandidatesWithStage).toHaveBeenCalledWith(
        3,
        0,
        10,
        columnName,
        sortDirection
      );
      expect(component.candidates).toBeUndefined();
      expect(component.dataSource).toBeUndefined();
      expect(snackBar.open).toHaveBeenCalledWith(
        `Failed to fetch candidates`,
        'Close',
        { duration: 2000 }
      );
    });
  });

  describe('announceSort', () => {
    it('should announce sort direction and call fetchCandidates when sortState direction is truthy', () => {
      const sortState = {
        active: 'firstName',
        direction: 'asc' as SortDirection,
      };
      component.fetchCandidatesWithStage = jasmine.createSpy(
        'fetchCandidatesWithStage'
      );

      component.announceSortChange(sortState);

      expect(liveAnnouncerSpy.announce).toHaveBeenCalledWith(
        'Sorted ascending'
      );
      expect(component.fetchCandidatesWithStage).toHaveBeenCalledWith(
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

  describe('sendEmail', () => {
    it('should open a dialog with the correct configuration', () => {
      const candidate: Candidate = {
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
      const dialogConfig: MatDialogConfig = {
        data: candidate,
        width: '50rem',
        height: '40rem',
      };

      const dialogRefMock: MatDialogRef<EmailFormComponent> =
        jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
      (dialogRefMock.afterClosed as jasmine.Spy).and.returnValue(
        of({ submitted: true, updatedCandidate: {} })
      );

      (dialogSpy.open as jasmine.Spy).and.returnValue(dialogRefMock);

      component.sendEmail(candidate);

      expect(dialogSpy.open).toHaveBeenCalledWith(
        EmailFormComponent,
        dialogConfig
      );
      expect(dialogRefMock.afterClosed).toHaveBeenCalled();
    });
  });

  describe('updateCandidate', () => {
    it('should update the candidate and show success message', () => {
      const candidate: Candidate = {
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
      const candidateId = 1;

      component.updateCandidate(candidate, candidateId);

      expect(candidateService.updateCandidate).toHaveBeenCalledWith(
        candidate,
        candidateId
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Candidate updated successfully',
        'Close',
        { duration: 2000 }
      );
    });

    xit('should handle failed candidate update and show error message', () => {
      const candidate: Candidate = {
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
      const candidateId = 1;

      component.updateCandidate(candidate, candidateId);

      expect(candidateService.updateCandidate).toHaveBeenCalledWith(
        candidate,
        candidateId
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Failed to update candidate due to',
        'Close',
        { duration: 2000 }
      );
    });
  });

  describe('updateStage', () => {
    it('should update the stage successfully and display a success message', () => {
      // Arrange
      const id = 1;
      const selectedStage = 'On Hold';

      // Act
      component.updateStage(id, { value: selectedStage } as MatSelectChange);

      // Assert
      expect(candidateService.updateCandidateStage).toHaveBeenCalledWith(
        id,
        selectedStage
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Stage updated successfully!',
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle error when updating the stage', () => {
      // Arrange
      const id = 1;
      const selectedStage = 'On Hold';
      const errorMessage = 'Failed to update stage';
      candidateService.updateCandidateStage.and.returnValue(
        throwError({ message: errorMessage })
      );

      // Act
      component.updateStage(id, { value: selectedStage } as MatSelectChange);

      // Assert
      expect(candidateService.updateCandidateStage).toHaveBeenCalledWith(
        id,
        selectedStage
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Updation failed due to ' + errorMessage,
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle empty stage selection', () => {
      // Arrange
      const id = 1;
      const selectedStage = '';

      // Act
      component.updateStage(id, { value: selectedStage } as MatSelectChange);

      // Assert
      expect(candidateService.updateCandidateStage).not.toHaveBeenCalled();
      expect(snackBar.open).not.toHaveBeenCalled();
    });
  });

  describe('updateRound', () => {
    it('should update the round successfully and display a success message', () => {
      // Arrange
      const id = 1;
      const selectedRound = 3;

      // Act
      component.updateRound(id, { value: selectedRound } as MatSelectChange);

      // Assert
      expect(candidateService.updateCandidateRound).toHaveBeenCalledWith(
        id,
        selectedRound
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Round updated successfully!',
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle error when updating the round', () => {
      // Arrange
      const id = 1;
      const selectedRound = 3;
      const errorMessage = 'Failed to update round';
      candidateService.updateCandidateRound.and.returnValue(
        throwError({ message: errorMessage })
      );

      // Act
      component.updateRound(id, { value: selectedRound } as MatSelectChange);

      // Assert
      expect(candidateService.updateCandidateRound).toHaveBeenCalledWith(
        id,
        selectedRound
      );
      expect(snackBar.open).toHaveBeenCalledWith('Updation failed', 'Close', {
        duration: 2000,
      });
    });
  });
});
