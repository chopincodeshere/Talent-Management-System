import { Component, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';

@Component({
  selector: 'app-interviewer-note',
  templateUrl: './interviewer-note.component.html',
  styleUrls: ['./interviewer-note.component.css'],
})
export class InterviewerNoteComponent {
  interviewerNotes: FormGroup;

  previousNote: string;

  constructor(
    private dialogRef: MatDialogRef<InterviewerNoteComponent>,
    private candidateService: CandidateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.interviewerNotes = new FormGroup({
      additionalNotes: new FormControl(''),
    });
  }

  ngOnInit() {
    this.fetchCandidateById();
  }

  fetchCandidateById() {
    this.candidateService
      .getCandidateById(this.data.id)
      .subscribe((response) => {
        if (response.notesByInterviewer) {
          this.interviewerNotes.patchValue({
            additionalNotes: response.notesByInterviewer,
          });
        }
      });
  }

  closeDialog(): void {
    this.dialogRef.close({
      submitted: false,
    });
  }

  submitNote(): void {
    this.candidateService
      .addInterviewerNote(
        this.interviewerNotes.value.additionalNotes,
        this.data.id
      )
      .subscribe(
        (response) => {
          this.snackBar.open('Comment has been added successfully!', 'Close', {
            duration: 2000,
          });
          this.closeDialog();
        },
        (error) =>
          this.snackBar.open(
            'Cannot add comment due to ' + error.message,
            'Close',
            { duration: 2000 }
          )
      );
  }
}
