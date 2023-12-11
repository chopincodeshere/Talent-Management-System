import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private closeModalSubject = new Subject<void>();
  closeModal$: Observable<void> = this.closeModalSubject.asObservable();

  close(): void {
    this.closeModalSubject.next();
  }
}
