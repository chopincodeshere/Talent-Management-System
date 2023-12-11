import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterviewerNoteComponent } from './interviewer-note.component';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('InterviewerNoteComponent', () => {
  let component: InterviewerNoteComponent;
  let fixture: ComponentFixture<InterviewerNoteComponent>;
  let candidateService: jasmine.SpyObj<CandidateService>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<any>>;

  beforeEach(async () => {
    candidateService = jasmine.createSpyObj('CandidateService', [
      'addInterviewerNote',
      'getCandidateById',
    ]);
    snackBar = jasmine.createSpyObj('MatSnackBar', ['open']);
    dialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);

    candidateService.getCandidateById.and.returnValue(
      of({
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
      })
    );

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [InterviewerNoteComponent],
      providers: [
        { provide: CandidateService, useValue: candidateService },
        { provide: MatSnackBar, useValue: snackBar },
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(InterviewerNoteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('submitNote', () => {
    it('should submit note successfully', () => {
      // Arrange
      const response = {};
      candidateService.addInterviewerNote.and.returnValue(of(response));
      const additionalNotes = 'Some additional notes';
      const id = 123;

      // Act
      component.interviewerNotes.setValue({ additionalNotes });
      component.data = { id };
      component.submitNote();

      // Assert
      expect(candidateService.addInterviewerNote).toHaveBeenCalledWith(
        additionalNotes,
        id
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Comment has been added successfully!',
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle error when submitting note', () => {
      // Arrange
      const error = { message: 'Some error message' };
      candidateService.addInterviewerNote.and.returnValue(throwError(error));
      const additionalNotes = 'Some additional notes';
      const id = 123;

      // Act
      component.interviewerNotes.setValue({ additionalNotes });
      component.data = { id };
      component.submitNote();

      // Assert
      expect(candidateService.addInterviewerNote).toHaveBeenCalledWith(
        additionalNotes,
        id
      );
      expect(snackBar.open).toHaveBeenCalledWith(
        'Cannot add comment due to ' + error.message,
        'Close',
        { duration: 2000 }
      );
    });
  });
});
