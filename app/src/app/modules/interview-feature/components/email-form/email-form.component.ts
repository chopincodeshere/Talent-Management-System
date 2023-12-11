import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { EmailService } from 'src/app/services/email-service/email.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
    );
  }
}

@Component({
  selector: 'app-email-form',
  templateUrl: './email-form.component.html',
  styleUrls: ['./email-form.component.css'],
})
export class EmailFormComponent {
  emailForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private dialogRef: MatDialogRef<EmailFormComponent>,
    private snackBar: MatSnackBar,
    private candidateService: CandidateService,
    private email: EmailService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.emailForm = this.formBuilder.group({
      receiverEmail: ['', [Validators.required, Validators.email]],
      subject: ['', Validators.required],
      messageBody: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.candidateService
      .getCandidateById(this.data.id)
      .subscribe((response) => {
        this.emailForm.get('receiverEmail')!.setValue(response.email);
      });
  }

  selectedFiles: File[] | null;

  matcher = new MyErrorStateMatcher();

  closeDialog(): void {
    this.dialogRef.close({
      submitted: false,
    });
  }

  onFileSelected(event: any): void {
    this.selectedFiles = event.target.file;
  }

  sendMail(): void {
    if (this.selectedFiles) {
      this.email
        .sendEmailWithAttachments(
          {
            receiverEmail: this.emailForm.value.receiverEmail,
            subject: this.emailForm.value.subject,
            messageBody: this.emailForm.value.messageBody,
          },
          this.selectedFiles
        )
        .subscribe(
          (response: any) => {
            this.snackBar.open('Email sent successfully!', 'Close', {
              duration: 2000,
            });
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open(
              'Email was not sent due to ' + error.message,
              'Close',
              { duration: 2000 }
            );
          }
        );
    } else {
      this.email.sendSimpleEmail(this.emailForm.value).subscribe(
        (response: any) => {
          this.snackBar.open('Email sent successfully!', 'Close', {
            duration: 2000,
          });
        },
        (error: HttpErrorResponse) => {
          console.log(error);
          this.snackBar.open(
            'Email was not sent due to ' + error.message,
            'Close',
            { duration: 2000 }
          );
        }
      );
    }
  }
}
