import { TestBed } from '@angular/core/testing';

import { EmailService } from './email.service';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, HttpClientTestingModule } from '@angular/common/http/testing';

describe('EmailService', () => {
    let emailService: EmailService;
    let httpTestingController: HttpTestingController;
  
    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [EmailService],
      });
  
      emailService = TestBed.inject(EmailService);
      httpTestingController = TestBed.inject(HttpTestingController);
    });
  
    afterEach(() => {
      httpTestingController.verify();
    });

  it('should be created', () => {
    expect(emailService).toBeTruthy();
  });

  describe('simpleMail', () => {
    it('should send a simple email', () => {
        // Arrange
        const email = {
          receiverEmail: 'test@example.com',
          subject: 'Test Email',
          messageBody: 'This is a test email',
        };
        const expectedResponse = 'Email sent successfully';
    
        // Act
        emailService.sendSimpleEmail(email).subscribe((response) => {
          // Assert
          expect(response).toEqual(expectedResponse);
        });
    
        // Assert
        const req = httpTestingController.expectOne('/email/sendEmail');
        expect(req.request.method).toBe('POST');
        expect(req.request.body).toEqual(email);
        req.flush(expectedResponse, { status: 200, statusText: 'OK' });
      });
  });

  describe('mailWithAttachments', () => {
    it('should send an email with attachments', () => {
        // Arrange
        const email = {
          receiverEmail: 'test@example.com',
          subject: 'Test Email',
          messageBody: 'This is a test email',
        };
        const files: File[] = [
          new File(['file1 content'], 'file1.txt'),
          new File(['file2 content'], 'file2.txt'),
        ];
        const expectedResponse = { success: true };
    
        // Act
        emailService.sendEmailWithAttachments(email, files).subscribe((response) => {
          // Assert
          expect(response).toEqual(expectedResponse);
        });
    
        // Assert
        const req = httpTestingController.expectOne('/email/sendEmailWithAttachment');
        expect(req.request.method).toBe('POST');
        expect(req.request.body instanceof FormData).toBeTruthy();
        expect(req.request.body.get('receiverEmail')).toBe(email.receiverEmail);
        expect(req.request.body.get('subject')).toBe(email.subject);
        expect(req.request.body.get('messageBody')).toBe(email.messageBody);
        expect(req.request.body.getAll('files')).toEqual(files);
        req.flush(expectedResponse, { status: 200, statusText: 'OK' });
      });
  })
});
