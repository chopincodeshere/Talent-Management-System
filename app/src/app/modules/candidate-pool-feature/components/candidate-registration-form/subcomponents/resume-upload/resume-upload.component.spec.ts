import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeUploadComponent } from './resume-upload.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ResumeUploadComponent', () => {
  let snackBar: MatSnackBar;
  let component: ResumeUploadComponent;
  let fixture: ComponentFixture<ResumeUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatSnackBarModule, BrowserAnimationsModule],
      declarations: [ResumeUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ResumeUploadComponent);
    component = fixture.componentInstance;

    snackBar = TestBed.inject(MatSnackBar);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set selected files and filename when a file is selected', () => {
    const file = new File(['dummy content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const inputEl = fixture.debugElement.query(
      By.css('input[type=file]')
    ).nativeElement;
    spyOnProperty(inputEl, 'files', 'get').and.returnValue([file]);

    component.selectFile({ target: inputEl });

    expect(component.selectedFiles).toEqual(file);
    expect(component.filename).toEqual('test.pdf');
  });

  it('should call openSnackBar when a file is selected', () => {
    const file = new File(['dummy content'], 'test.pdf', {
      type: 'application/pdf',
    });
    const inputEl = fixture.debugElement.query(
      By.css('input[type=file]')
    ).nativeElement;
    spyOnProperty(inputEl, 'files', 'get').and.returnValue([file]);
    spyOn(component, 'openSnackBar');

    component.selectFile({ target: inputEl });

    expect(component.openSnackBar).toHaveBeenCalled();
  });

  it('should clear the selected file', () => {
    component.filename = 'sample-resume.pdf';
    component.uploaded = true;
    sessionStorage.setItem('resume', 'sample base64 string');
    spyOn(snackBar, 'open');

    component.clearFile();

    expect(sessionStorage.getItem('resume')).toBeNull();
    expect(component.uploaded).toBeFalse();
    expect(component.message).toBe('sample-resume.pdf deleted successfully!!!');
    expect(component.filename).toBe('');
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('should open a snackbar with the given message', () => {
    spyOn(snackBar, 'open');

    component.message = 'File uploaded successfully!!!';
    component.openSnackBar();

    expect(snackBar.open).toHaveBeenCalledWith(
      'File uploaded successfully!!!',
      component.action,
      { duration: component.durationInSeconds * 1000 }
    );
  });
});
