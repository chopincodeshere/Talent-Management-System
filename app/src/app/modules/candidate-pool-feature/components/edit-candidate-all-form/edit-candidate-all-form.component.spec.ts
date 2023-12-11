import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCandidateAllFormComponent } from './edit-candidate-all-form.component';

describe('EditCandidateAllFormComponent', () => {
  let component: EditCandidateAllFormComponent;
  let fixture: ComponentFixture<EditCandidateAllFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditCandidateAllFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCandidateAllFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
