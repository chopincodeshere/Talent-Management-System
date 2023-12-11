import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Candidate } from 'src/app/core/models/candidate';
import { CandidateResponse } from 'src/app/core/models/candidateResponse';
import { EditCandidateFormComponent } from 'src/app/modules/interview-feature/components/edit-candidate-form/edit-candidate-form.component';
import { EmailFormComponent } from 'src/app/modules/interview-feature/components/email-form/email-form.component';
import { InterviewerNoteComponent } from 'src/app/modules/interview-feature/components/interviewer-note/interviewer-note.component';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { CandidateDataService } from 'src/app/shared/services/candidate-data.service';

@Component({
  selector: 'app-dashboard-job-status',
  templateUrl: './dashboard-job-status.component.html',
  styleUrls: ['./dashboard-job-status.component.css'],
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
export class DashboardJobStatusComponent {
  key: number;
  candidates: CandidateResponse[];

  dataSourceExists: boolean = true;

  length: number;
  pageIndex: number = 0;
  pageSize: number = 10;

  isLoading: boolean = false;

  rounds: number[] = [1, 2, 3, 4];
  stages: string[] = ['Inactive', 'Rejected', 'On-Hold', 'Hired'];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSource: any;
  columnsToDisplay = [
    'ID',
    'Name',
    'Received',
    'Source',
    'Stage',
    'Feedback',
    'Action',
    'Round',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: CandidateResponse | null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private candidateService: CandidateService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private _liveAnnouncer: LiveAnnouncer,
    private candidateDataService: CandidateDataService
  ) {}

  ngOnInit() {
    this.route.params.subscribe((params) => {
      this.key = Number(params['key']);
    });

    this.setLength();

    this.isLoading = true;

    if (this.dataSource) {
      this.dataSource.sort = this.sort;
    }

    this.candidateDataService.dataSourceChanges.subscribe(
      (dataSource: MatTableDataSource<CandidateResponse>) => {
        this.isLoading = false;
        this.dataSource = dataSource;
        if (dataSource.data.length > 0) {
          this.dataSourceExists = false;
        }
      }
    );

    if (!this.route.snapshot.queryParams) {
      this.fetchCandidatesWithStage();
    }
  }

  setLength() {
    switch (this.key) {
      case 3:
        this.candidateService.getNumberOfShortlistedCandidates().subscribe(
          (response) => {
            this.length = response;
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open('Error fetching length of the page', 'Close', {
              duration: 2000,
            });
          }
        );
        break;

      case 4:
        this.candidateService.getNumberOfHiredCandidates().subscribe(
          (response) => {
            this.length = response;
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open('Error fetching length of the page', 'Close', {
              duration: 2000,
            });
          }
        );
        break;

      case 5:
        this.candidateService.getNumberOfOnHoldCandidates().subscribe(
          (response) => {
            this.length = response;
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open('Error fetching length of the page', 'Close', {
              duration: 2000,
            });
          }
        );
        break;

      case 6:
        this.candidateService.getNumberOfRejectedCandidates().subscribe(
          (response) => {
            this.length = response;
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open('Error fetching length of the page', 'Close', {
              duration: 2000,
            });
          }
        );
        break;

      case 7:
        this.candidateService.getNumberOfInactiveCandidates().subscribe(
          (response) => {
            this.length = response;
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open('Error fetching length of the page', 'Close', {
              duration: 2000,
            });
          }
        );
        break;

      default:
        break;
    }
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      this.fetchCandidatesWithStage(sortState.active, sortState.direction);
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

  fetchCandidatesWithStage(
    columnName: string = 'id',
    sortDirection: string = 'asc'
  ) {
    this.isLoading = true;

    this.candidateService
      .getCandidatesWithStage(
        this.key,
        this.pageIndex,
        this.pageSize,
        columnName,
        sortDirection
      )
      .subscribe(
        (response: CandidateResponse[]) => {
          this.candidates = response;
          this.isLoading = false;

          this.dataSource = new MatTableDataSource<CandidateResponse>(
            this.candidates
          );
        },
        (error: HttpErrorResponse) => {
          this.isLoading = false;

          this.snackBar.open('Failed to fetch candidates', 'Close', {
            duration: 2000,
          });
        }
      );
  }

  openFeedbackForm(candidateId: number): void {
    this.router.navigateByUrl(`/dashboard/feedback/${candidateId}/${this.key}`);
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
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    let keywords = this.candidateDataService.getKeywords();
    let filters = this.candidateDataService.getStageFilters();

    if (keywords) {
      this.candidateService
        .getCandidatesWithStageAndKeywords(
          this.key!,
          keywords,
          this.pageIndex,
          this.pageSize
        )
        .subscribe(
          (data: CandidateResponse[]) => {
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
        .getCandidatesWithStageAndFilters(
          this.key!,
          this.pageIndex,
          this.pageSize,
          filters
        )
        .subscribe(
          (response) => {
            this.dataSource = new MatTableDataSource<CandidateResponse>(
              response.content
            );

            this.length = response.size;
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
      this.fetchCandidatesWithStage();
    }
  }

  routeBack(): void {
    this.router.navigateByUrl(`/dashboard`);
  }

  updateCandidate(candidate: Candidate, candidateId: number): void {
    this.candidateService.updateCandidate(candidate, candidateId).subscribe(
      (updatedCandidate) => {
        this.snackBar.open('Candidate updated successfully', 'Close', {
          duration: 2000,
        });

        setTimeout(() => {
          this.fetchCandidatesWithStage();
        }, 500);
      },
      (error) => {
        this.snackBar.open('Failed to update candidate due to ', 'Close', {
          duration: 2000,
        });
      }
    );
  }

  updateStage(id: number, event: MatSelectChange): void {
    const selectedStage = event.value as string;
    if (selectedStage) {
      this.candidateService.updateCandidateStage(id, selectedStage).subscribe(
        () => {
          this.snackBar.open('Stage updated successfully!', 'Close', {
            duration: 2000,
          });
        },
        (error) => {
          this.snackBar.open(
            'Updation failed due to ' + error.message,
            'Close',
            { duration: 2000 }
          );
        }
      );
    }
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
          this.snackBar.open('Updation failed', 'Close', { duration: 2000 })
      );
  }
}
