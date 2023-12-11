import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Email } from 'src/app/core/models/email';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor(private http: HttpClient) {}

  public sendSimpleEmail(email: Email): Observable<string> {
    return this.http.post(`/email/sendEmail`, email, { responseType: 'text' });
  }

  sendEmailWithAttachments(email: Email, files: File[]): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('receiverEmail', email.receiverEmail);
    formData.append('subject', email.subject);
    formData.append('messageBody', email.messageBody);
    
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    
    return this.http.post(`/email/sendEmailWithAttachment`, formData);
  }
  
}
