import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { Candidate } from 'src/app/core/models/candidate';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { CandidateDataService } from 'src/app/shared/services/candidate-data.service';
import { EditCandidateFormComponent } from '../edit-candidate-form/edit-candidate-form.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { JobService } from 'src/app/services/job-service/job.service';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Sort } from '@angular/material/sort';
import { InterviewerNoteComponent } from '../interviewer-note/interviewer-note.component';
import { EmailFormComponent } from '../email-form/email-form.component';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';

@Component({
  selector: 'app-candidates',
  templateUrl: './candidates.component.html',
  styleUrls: ['./candidates.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class CandidatesComponent {
  candidates: CandidateResponse[];
  candidateId: number;
  displayedColumns: string[] = [
    'Id',
    'Name',
    'Received',
    'Source',
    'Stage',
    'Feedback',
    'Action',
    'Round',
  ];
  columnsToDisplayWithExpand = [...this.displayedColumns, 'expand'];
  expandedElement: CandidateResponse | null;

  dataSource: any;
  stages: string[] = ['Inactive', 'Rejected', 'On-Hold', 'Hired'];

  numberOfFeedbacks: number;

  jobId: number;

  isLoading: boolean = false;

  length: number;
  pageIndex: number = 0;
  pageSize: number = 10;

  rounds: number[] = [1, 2, 3, 4];

  role: boolean;

  constructor(
    private candidateDataService: CandidateDataService,
    private candidateService: CandidateService,
    private dialog: MatDialog,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar,
    private jobService: JobService,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.jobId = params['jobId'];
    });

    this.candidateDataService.setJob(this.jobId);
    this.candidateDataService.dataSourceChanges.subscribe(
      (dataSource: MatTableDataSource<CandidateResponse>) => {
        this.dataSource = dataSource;
      }
    );

    this.candidateId = this.candidateDataService.getCandidates();
    if (
      !this.route.snapshot.queryParams ||
      !this.route.snapshot.queryParams.keywords ||
      !this.route.snapshot.queryParams.filters
    ) {
      this.fetchCandidates();
    }

    this.jobService.getCandidateCountByJob(this.jobId).subscribe(
      (count: number) => {
        console.log(count);

        this.length = count;
      },
      (error: HttpErrorResponse) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 2000,
        });
      }
    );
  }

  routeBack(): void {
    this.router.navigateByUrl('/interview/jobs');
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      this.fetchCandidates(sortState.active, sortState.direction);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  fetchResumeById(id: number): void {
    this.candidateService.getResumeFileById(id).subscribe(
      (file: Blob) => {
        const fileURL = URL.createObjectURL(file);
        const fileType = file.type;

        if (fileType === 'application/pdf') {
          window.open(fileURL, '_blank');
        } else {
          const link = document.createElement('a');
          link.href = fileURL;
          link.download = 'file'; // Set the desired file name
          link.click();
        }
      },
      (error: HttpErrorResponse) => {
        error.status === 404
          ? this.snackBar.open('Resume not found', 'Close', { duration: 2000 })
          : this.snackBar.open('Internal Server error', 'Close', {
              duration: 2000,
            });
      }
    );
  }

  openFeedbackForm(candidateId: number): void {
    this.router.navigateByUrl(`/interview/jobs/feedback/${candidateId}`);
  }

  editCandidate(element: Candidate): void {
    // Fetch the candidate data or create a new instance of the Candidate model
    const candidate: Candidate = element;

    const dialogConfig: MatDialogConfig = {
      data: candidate, // Pass the candidate data to the dialog
      width: '50rem', // Set the width of the dialog box
      height: '40rem', // Set the height of the dialog box
    };

    // Open a dialog or navigate to a new component to edit the candidate data
    const dialogRef = this.dialog.open(
      EditCandidateFormComponent,
      dialogConfig
    );

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) {
        this.updateCandidate(result.updatedCandidate, dialogConfig.data);
      }
    });
  }

  showComments(candidateId: number): void {
    this.router.navigateByUrl(`/interview/jobs/feedbacks/${candidateId}`);
  }

  addNote(element: Candidate): void {
    // Fetch the candidate data or create a new instance of the Candidate model
    const candidate: Candidate = element;

    const dialogConfig: MatDialogConfig = {
      data: candidate, // Pass the candidate data to the dialog
      width: '30rem', // Set the width of the dialog box
      height: '23rem', // Set the height of the dialog box
    };

    // Open a dialog or navigate to a new component to edit the candidate data
    const dialogRef = this.dialog.open(InterviewerNoteComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) {
        this.updateCandidate(result.updatedCandidate, dialogConfig.data);
      }
    });
  }

  sendEmail(element: Candidate): void {
    // Fetch the candidate data or create a new instance of the Candidate model
    const candidate: Candidate = element;

    const dialogConfig: MatDialogConfig = {
      data: candidate, // Pass the candidate data to the dialog
      width: '50rem', // Set the width of the dialog box
      height: '40rem', // Set the height of the dialog box
    };

    // Open a dialog or navigate to a new component to edit the candidate data
    const dialogRef = this.dialog.open(EmailFormComponent, dialogConfig);

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.submitted) {
        this.updateCandidate(result.updatedCandidate, dialogConfig.data);
      }
    });
  }

  onPageChange(event: PageEvent) {
    let keywords = this.candidateDataService.getKeywords();
    let filters = this.candidateDataService.getJobFilters();

    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;

    if (keywords) {
      this.candidateService
        .getCandidateByJobAndKeywords(
          this.jobId!,
          keywords,
          this.pageIndex,
          this.pageSize
        )
        .subscribe(
          (data) => {
            this.dataSource = new MatTableDataSource<CandidateResponse>(data);
            this.candidates = data;

            this.candidateDataService.dataSource = this.dataSource;
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.snackBar.open('Candidate not found', 'Close', {
                duration: 2000,
              });
            } else if (error.status === 500) {
              this.snackBar.open('Error on server side', 'Close', {
                duration: 2000,
              });
            } else {
              this.snackBar.open(
                `Failed to fetch candidates. Error code: ${error.status}`,
                'Close',
                {
                  duration: 2000,
                }
              );
            }
          }
        );
    } else if (filters) {
      this.candidateService
        .getCandidateByJobAndFilters(
          this.jobId!,
          filters,
          this.pageIndex,
          this.pageSize
        )
        .subscribe(
          (data: any) => {
            this.dataSource = new MatTableDataSource<CandidateResponse>(
              data.content
            );
            this.candidates = data.content;
            console.log(data);

            this.length = data.content.length;
            this.candidateDataService.dataSource = this.dataSource;
          },
          (error: HttpErrorResponse) => {
            if (error.status === 404) {
              this.snackBar.open('Candidate not found', 'Close', {
                duration: 2000,
              });
            } else if (error.status === 500) {
              this.snackBar.open('Error on server side', 'Close', {
                duration: 2000,
              });
            } else {
              this.snackBar.open(
                `Failed to fetch candidates. Error code: ${error.status}`,
                'Close',
                {
                  duration: 2000,
                }
              );
            }
          }
        );
    } else {
      this.fetchCandidates();
    }
  }

  updateCandidate(candidate: Candidate, candidateId: number): void {
    this.candidateService.updateCandidate(candidate, candidateId).subscribe(
      (updatedCandidate) => {
        this.snackBar.open('Candidate updated successfully', 'Close', {
          duration: 2000,
        });

        setTimeout(() => {
          this.fetchCandidates();
        }, 500);
      },
      (error) => {
        this.snackBar.open(
          'Failed to update candidate due to ' + error.message,
          'Close',
          {
            duration: 2000,
          }
        );
      }
    );
  }

  updateStage(id: number, event: MatSelectChange): void {
    const selectedStage = event.value;

    this.candidateService.updateCandidateStage(id, selectedStage).subscribe(
      (response) => {
        this.snackBar.open('Stage updated successfully!', 'Close', {
          duration: 2000,
        });
      },
      (error) => {
        this.snackBar.open('Updation failed due to ' + error.message, 'Close', {
          duration: 2000,
        });
      }
    );
  }

  updateRound(candidateId: number, event: MatSelectChange): void {
    const selectedRound = event.value;

    this.candidateService
      .updateCandidateRound(candidateId, selectedRound)
      .subscribe(
        (response) => {
          this.snackBar.open('Round updated successfully!', 'Close', {
            duration: 2000,
          });
        },
        (error) =>
          this.snackBar.open(error.message, 'Close', { duration: 2000 })
      );
  }

  fetchCandidates(
    columnName: string = 'id',
    sortDirection: string = 'asc'
  ): void {
    this.isLoading = true;
    this.candidateService
      .getCandidatesByJobPosition(
        this.candidateId,
        this.pageIndex,
        this.pageSize,
        columnName,
        sortDirection
      )
      .subscribe(
        (response) => {
          this.candidates = response;
          this.isLoading = false;
          this.dataSource = new MatTableDataSource(this.candidates);
        },
        (error: HttpErrorResponse) => {
          this.snackBar.open(
            'Error fetching candidates due to ' + error.message,
            'Close',
            { duration: 2000 }
          );
          this.isLoading = false;
        }
      );
  }
}
