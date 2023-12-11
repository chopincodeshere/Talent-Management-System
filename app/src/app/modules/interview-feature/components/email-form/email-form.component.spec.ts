import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailFormComponent } from './email-form.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EmailService } from 'src/app/services/email-service/email.service';
import { of, throwError } from 'rxjs';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpErrorResponse } from '@angular/common/http';

describe('EmailFormComponent', () => {
  let component: EmailFormComponent;
  let fixture: ComponentFixture<EmailFormComponent>;
  let emailService: EmailService;
  let snackBar: MatSnackBar;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
      ],
      declarations: [EmailFormComponent],
      providers: [
        EmailService,
        MatSnackBar,
        { provide: MatDialogRef, useValue: {} },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailFormComponent);
    component = fixture.componentInstance;
    snackBar = TestBed.inject(MatSnackBar);
    emailService = TestBed.inject(EmailService);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('sendMail', () => {
    beforeEach(() => {
      // Mock the emailForm value
      component.emailForm.setValue({
        receiverEmail: 'receiver@example.com',
        subject: 'Test Subject',
        messageBody: 'Test Message',
      });
    });

    it('should send email with attachments', () => {
      const mockEmailFormValue = {
        receiverEmail: 'receiver@example.com',
        subject: 'Test Subject',
        messageBody: 'Test Message',
      };
      const mockResponse = { message: 'Email sent successfully!' };

      // Mock selectedFiles array with some dummy files
      const file1 = new File(['dummy content'], 'dummy-file1.txt', {
        type: 'text/plain',
      });
      const file2 = new File(['dummy content'], 'dummy-file2.txt', {
        type: 'text/plain',
      });

      // Mock selected files
      component.selectedFiles = [file1, file2];

      spyOn(
        (component as any).email,
        'sendEmailWithAttachments'
      ).and.returnValue(of(mockResponse));
      spyOn((component as any).snackBar, 'open');

      // Trigger the method
      component.sendMail();

      // Assertion
      expect(
        (component as any).email.sendEmailWithAttachments
      ).toHaveBeenCalledWith(mockEmailFormValue, component.selectedFiles);
      expect((component as any).snackBar.open).toHaveBeenCalledWith(
        'Email sent successfully!',
        'Close',
        { duration: 2000 }
      );
    });

    it('should send simple email', () => {
      const mockEmailFormValue = {
        receiverEmail: 'receiver@example.com',
        subject: 'Test Subject',
        messageBody: 'Test Message',
      };
      const mockResponse = { message: 'Email sent successfully!' };

      // Clear selected files
      component.selectedFiles = null;

      spyOn((component as any).email, 'sendSimpleEmail').and.returnValue(
        of(mockResponse)
      );
      spyOn((component as any).snackBar, 'open');

      // Trigger the method
      component.sendMail();

      // Assertion
      expect((component as any).email.sendSimpleEmail).toHaveBeenCalledWith(
        mockEmailFormValue
      );
      expect((component as any).snackBar.open).toHaveBeenCalledWith(
        'Email sent successfully!',
        'Close',
        { duration: 2000 }
      );
    });

    it('should handle error when sending simple email', () => {
      const errorResponse = new HttpErrorResponse({
        error: 'test 404 error',
        status: 404,
        statusText: 'Not Found',
      });

      spyOn(emailService, 'sendSimpleEmail').and.returnValue(
        throwError(errorResponse)
      );
      spyOn(component['snackBar'], 'open');

      component.sendMail();

      expect(component['snackBar'].open).toHaveBeenCalledWith(
        'Email was not sent due to ' + errorResponse.message,
        'Close',
        { duration: 2000 }
      );
    });
  });
});
