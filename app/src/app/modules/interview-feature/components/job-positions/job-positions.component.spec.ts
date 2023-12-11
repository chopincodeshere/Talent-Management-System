import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobPositionsComponent } from './job-positions.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { JobService } from 'src/app/services/job-service/job.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { of, throwError } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';

describe('JobPositionsComponent', () => {
  let component: JobPositionsComponent;
  let fixture: ComponentFixture<JobPositionsComponent>;
  let jobService: JobService;
  let snackBar: MatSnackBar;

  let mockJobs: JobResponse[] = [
    {
      id: 1,
      jobTitle: 'Software Engineer',
      jobStatus: 'Open',
      hiringManagers: ['John Doe', 'Jane Smith'],
      jobDescription: null,
      requirements: 'Job Requirements',
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JobPositionsComponent],
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        BrowserAnimationsModule,
      ],
      providers: [JobService, MatSnackBar],
    }).compileComponents();

    fixture = TestBed.createComponent(JobPositionsComponent);
    component = fixture.componentInstance;
    jobService = TestBed.inject(JobService);
    snackBar = TestBed.inject(MatSnackBar);

    // Initialize the dataSource property with mock data
    component.dataSource = new MatTableDataSource(mockJobs);

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
