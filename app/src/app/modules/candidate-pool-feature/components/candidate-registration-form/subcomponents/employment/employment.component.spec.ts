import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmploymentComponent } from './employment.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormArray, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('EmploymentComponent', () => {
  let component: EmploymentComponent;
  let fixture: ComponentFixture<EmploymentComponent>;
  let dialogRef: MatDialogRef<EmploymentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule, MaterialModule, BrowserAnimationsModule],
      declarations: [EmploymentComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRef },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmploymentComponent);
    dialogRef = TestBed.inject(MatDialogRef);
    component = fixture.componentInstance;
    component.candidateForm = new FormGroup({
      employment: new FormArray([]) 
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
