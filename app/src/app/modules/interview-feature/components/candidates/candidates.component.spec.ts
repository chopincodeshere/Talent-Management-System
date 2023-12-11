import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CandidatesComponent } from './candidates.component';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { Candidate } from 'src/app/core/models/candidate';
import { InterviewerNoteComponent } from '../interviewer-note/interviewer-note.component';
import { EditCandidateFormComponent } from '../edit-candidate-form/edit-candidate-form.component';
import { EmailFormComponent } from '../email-form/email-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectChange } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { MatTableDataSource } from '@angular/material/table';

describe('CandidatesComponent', () => {
  let component: CandidatesComponent;
  let fixture: ComponentFixture<CandidatesComponent>;
  let dialogSpy: jasmine.SpyObj<MatDialog>;
  let snackBar: MatSnackBar;
  let candidateService: CandidateService;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<EmailFormComponent>>;
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

  let router: Router;

  beforeEach(async () => {
    dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        RouterTestingModule,
        SearchModule,
        BrowserAnimationsModule,
      ],
      declarations: [CandidatesComponent],
      providers: [
        CandidateService,
        MatSnackBar,
        { provide: MatDialog, useValue: dialogSpy }
      ],
      teardown: {destroyAfterEach: false} 
    }).compileComponents();

    router = TestBed.inject(Router);
    snackBar = TestBed.inject(MatSnackBar);
    candidateService = TestBed.inject(CandidateService);
    fixture = TestBed.createComponent(CandidatesComponent);
    component = fixture.componentInstance;
    spyOn(router, 'navigateByUrl');

    // Initialize the dataSource property with mock data
    component.dataSource = new MatTableDataSource(mockCandidates);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('editCandidate', () => {
    it('should open EditCandidateFormComponent dialog and update candidate when result is submitted', () => {
      // Arrange
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
      const dialogResult = {
        submitted: true,
        updatedCandidate: {
          id: 1,
          firstName: 'Josh',
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
        },
      };
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(dialogResult),
      } as MatDialogRef<EditCandidateFormComponent>);

      spyOn(component, 'updateCandidate');

      // Act
      component.editCandidate(candidate);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(
        EditCandidateFormComponent,
        jasmine.objectContaining({
          data: candidate,
          width: '50rem',
          height: '40rem',
        })
      );

      expect(component.updateCandidate).toHaveBeenCalledWith(
        dialogResult.updatedCandidate,
        jasmine.objectContaining(candidate)
      );
    });

    it('should not update candidate when dialog result is not submitted', () => {
      // Arrange
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
      const dialogResult = {
        submitted: false,
        updatedCandidate: {
          id: 1,
          firstName: 'Josh',
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
        },
      };
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(dialogResult),
      } as MatDialogRef<EditCandidateFormComponent>);

      spyOn(component, 'updateCandidate');

      // Act
      component.editCandidate(candidate);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(
        EditCandidateFormComponent,
        jasmine.objectContaining({
          data: candidate,
          width: '50rem',
          height: '40rem',
        })
      );

      expect(component.updateCandidate).not.toHaveBeenCalled();
    });
  });

  describe('showComments', () => {
    it('should navigate to the correct URL', () => {
      const candidateId = 123;
      component.showComments(candidateId);
      expect(router.navigateByUrl).toHaveBeenCalledWith(
        `/interview/jobs/feedbacks/${candidateId}`
      );
    });
  });

  describe('addNote', () => {
    it('should open InterviewerNoteComponent dialog and update candidate when result is submitted', () => {
      // Arrange
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
      const dialogResult = {
        submitted: true,
        updatedCandidate: {
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
          notesByInterviewer: 'Additional notes',
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
        },
      };
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(dialogResult),
      } as MatDialogRef<InterviewerNoteComponent>);

      spyOn(component, 'updateCandidate');

      // Act
      component.addNote(candidate);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(
        InterviewerNoteComponent,
        jasmine.objectContaining({
          data: candidate,
          width: '30rem',
          height: '23rem',
        })
      );

      expect(component.updateCandidate).toHaveBeenCalledWith(
        dialogResult.updatedCandidate,
        jasmine.objectContaining(candidate)
      );
    });

    it('should not update candidate when dialog result is not submitted', () => {
      // Arrange
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
      const dialogResult = {
        submitted: false,
        updatedCandidate: {
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
          notesByInterviewer: 'Additional notes',
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
        },
      };
      dialogSpy.open.and.returnValue({
        afterClosed: () => of(dialogResult),
      } as MatDialogRef<InterviewerNoteComponent>);

      spyOn(component, 'updateCandidate');

      // Act
      component.addNote(candidate);

      // Assert
      expect(dialogSpy.open).toHaveBeenCalledWith(
        InterviewerNoteComponent,
        jasmine.objectContaining({
          data: candidate,
          width: '30rem',
          height: '23rem',
        })
      );

      expect(component.updateCandidate).not.toHaveBeenCalled();
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

      // Mock the updateCandidate method of candidateService
      const candidateServiceSpy = spyOn(
        (component as any).candidateService,
        'updateCandidate'
      ).and.returnValue(of(candidate));

      // Mock the snackBar
      const snackBarOpenSpy = spyOn((component as any).snackBar, 'open');

      component.updateCandidate(candidate, candidateId);

      expect(candidateServiceSpy).toHaveBeenCalledWith(candidate, candidateId);
      expect(snackBarOpenSpy).toHaveBeenCalledWith(
        'Candidate updated successfully',
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle failed candidate update and show error message', () => {
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
      const errorMessage = 'Update failed';

      // Mock the updateCandidate method of candidateService to throw an error
      const updateCandidateSpy = spyOn(
        (component as any).candidateService,
        'updateCandidate'
      ).and.returnValue(throwError({ message: errorMessage }));

      // Mock the snackBar
      const snackBarOpenSpy = spyOn((component as any).snackBar, 'open');

      component.updateCandidate(candidate, candidateId);

      expect(updateCandidateSpy).toHaveBeenCalledWith(candidate, candidateId);
      expect(snackBarOpenSpy).toHaveBeenCalledWith(
        'Failed to update candidate due to ' + errorMessage,
        'Close',
        { duration: 2000 }
      );
    });
  });

  describe('updateStage', () => {
    it('should update the candidate round and log response', () => {
      const id = 1;
      const selectedStage = 'Selected';
      const event = { value: selectedStage } as MatSelectChange;

      spyOn(candidateService, 'updateCandidateStage').and.returnValue(of({}));

      spyOn(snackBar, 'open');
      component.updateStage(id, event);

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

    it('should show error message on stage update failure', () => {
      const id = 1;
      const selectedStage = 'Interview';
      const errorMessage = 'Error message';

      spyOn(candidateService, 'updateCandidateStage').and.returnValue(
        throwError({ message: errorMessage })
      );
      spyOn(snackBar, 'open');

      const event = { value: selectedStage } as MatSelectChange;
      component.updateStage(id, event);

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
  });

  describe('updateRound', () => {
    it('should update the candidate round and display success message', () => {
      const candidateId = 1;
      const selectedRound = 2;
      const event = { value: selectedRound } as MatSelectChange;
      spyOn(candidateService, 'updateCandidateRound').and.returnValue(of({}));
      spyOn(snackBar, 'open');
      component.updateRound(candidateId, event);

      expect(candidateService.updateCandidateRound).toHaveBeenCalledWith(
        candidateId,
        selectedRound
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Round updated successfully!',
        'Close',
        { duration: 2000 }
      );
    });

    it('should display error message on round update failure', () => {
      const candidateId = 1;
      const selectedRound = 2;
      const errorMessage = 'Error message';
      const event = { value: selectedRound } as MatSelectChange;

      spyOn(candidateService, 'updateCandidateRound').and.returnValue(
        throwError({ message: errorMessage })
      );
      spyOn(snackBar, 'open');

      component.updateRound(candidateId, event);

      expect(candidateService.updateCandidateRound).toHaveBeenCalledWith(
        candidateId,
        selectedRound
      );
      expect(snackBar.open).toHaveBeenCalledWith(errorMessage, 'Close', {
        duration: 2000,
      });
    });
  });

  describe('fetchCandidates', () => {
    it('should call candidateService.getCandidatesByJobPosition() with correct arguments', () => {
      const columnName = 'id';
      const sortDirection = 'asc';
      spyOn(
        (component as any).candidateService,
        'getCandidatesByJobPosition'
      ).and.returnValue(of([] as CandidateResponse[]));

      (component as any).fetchCandidates(columnName, sortDirection);

      expect(
        (component as any).candidateService.getCandidatesByJobPosition
      ).toHaveBeenCalledWith(
        component.candidateId,
        component.pageIndex,
        component.pageSize,
        columnName,
        sortDirection
      );
    });

    it('should set candidates and dataSource when getCandidatesByJobPosition returns a response', () => {
      const candidates = [] as CandidateResponse[];
      spyOn(
        (component as any).candidateService,
        'getCandidatesByJobPosition'
      ).and.returnValue(of(candidates));

      component.fetchCandidates();

      expect(component.candidates).toBe(candidates);
      expect(component.dataSource.data).toBe(candidates);
    });

    it('should set candidates and dataSource when getCandidatesByJobPosition returns a response', () => {
      const candidates = [] as CandidateResponse[];
      spyOn(
        (component as any).candidateService,
        'getCandidatesByJobPosition'
      ).and.returnValue(of(candidates));

      component.fetchCandidates();

      expect(component.candidates).toBe(candidates);
      expect(component.dataSource.data).toBe(candidates);
    });
  });
});
