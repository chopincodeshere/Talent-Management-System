import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportsMainComponent } from './reports-main.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/shared/modules/material.module';

describe('ReportsMainComponent', () => {
  let component: ReportsMainComponent;
  let fixture: ComponentFixture<ReportsMainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReportsMainComponent],
      imports: [HttpClientTestingModule, MaterialModule],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportsMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
