import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { JobService } from 'src/app/services/job-service/job.service';
import { JobPositionFormComponent } from '../job-position-form/job-position-form.component';
import { MatDialog } from '@angular/material/dialog';
import { HttpErrorResponse } from '@angular/common/http';
import { CandidateDataService } from 'src/app/shared/services/candidate-data.service';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/shared/services/modal.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PageEvent } from '@angular/material/paginator';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Sort } from '@angular/material/sort';
import { DeleteConfirmationComponent } from 'src/app/shared/components/delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-job-positions',
  templateUrl: './job-positions.component.html',
  styleUrls: ['./job-positions.component.css'],
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
export class JobPositionsComponent {
  dataSource: any;

  jobs: JobResponse[];

  columnsToDisplay = [
    'jobTitle',
    'hiringManagers',
    'candidateCount',
    'jobStatus',
    'Options',
  ];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: JobResponse | null;

  jobsCount: number;
  candidateCount: number;

  pageIndex: number = 0;
  pageSize: number = 5;

  isLoading: boolean = false;

  openModalSwitch: boolean = false;

  constructor(
    private jobService: JobService,
    private router: Router,
    private candidateDataService: CandidateDataService,
    private dialog: MatDialog,
    private modalService: ModalService,
    private snackBar: MatSnackBar,
    private _liveAnnouncer: LiveAnnouncer
  ) {}

  ngOnInit() {
    this.fetchJobs();
    this.getJobCount();
  }

  openModal(jobId?: number): void {
    const dialogRef = this.dialog.open(JobPositionFormComponent, {
      data: jobId,
      width: '40rem',
      height: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.added) {
        setTimeout(() => {
          this.fetchJobs();
        }, 500);
      }
    });
  }

  private isValidBase64String(str: string): boolean {
    try {
      return btoa(atob(str)) === str;
    } catch (error) {
      return false;
    }
  }

  private getFileMimeType(base64: string): string | null {
    const data = atob(base64);

    const bytes = new Uint8Array(data.length);
    for (let i = 0; i < data.length; i++) {
      bytes[i] = data.charCodeAt(i);
    }

    let mimeType = null;

    // Checking the file signature
    const signature = bytes.subarray(0, 4);
    if (this.compareByteArrays(signature, [0x89, 0x50, 0x4e, 0x47])) {
      mimeType = 'image/png';
    } else if (this.compareByteArrays(signature, [0x25, 0x50, 0x44, 0x46])) {
      mimeType = 'application/pdf';
    } else if (this.compareByteArrays(signature, [0xff, 0xd8, 0xff])) {
      mimeType = 'image/jpeg';
    } else if (this.compareByteArrays(signature, [0x50, 0x4b, 0x03, 0x04])) {
      mimeType =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // .docx
      // mimeType = 'application/msword'; // .doc (older Word format)
    }

    return mimeType;
  }

  private compareByteArrays(array1: Uint8Array, array2: number[]): boolean {
    if (array1.length !== array2.length) {
      return false;
    }

    for (let i = 0; i < array1.length; i++) {
      if (array1[i] !== array2[i]) {
        return false;
      }
    }

    return true;
  }

  private showFileInNewTab(base64: string, fileName: string, mimeType: string) {
    const byteString = atob(base64);
    console.log(byteString);

    console.log(this.isValidBase64String(base64));

    const arrayBuffer = new ArrayBuffer(byteString.length);
    const uint8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      uint8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([uint8Array], { type: mimeType });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.target = '_blank';
    link.download = fileName;
    link.click();
  }

  showJobDescription(element: any) {
    const base64 = element.jobDescription;
    const fileName = element.jobTitle;
    const mimeType = this.getFileMimeType(base64);

    if (mimeType) {
      this.showFileInNewTab(base64, fileName, mimeType);
    }
  }

  getJobCount(): void {
    this.jobService.getTotalJobCount().subscribe(
      (response) => {
        this.jobsCount = response;
        if (this.jobsCount === 0) {
          this.isLoading = false;
        }
      },
      (error) => this.snackBar.open(error.message, 'Close', { duration: 2000 })
    );
  }

  editJob(jobId: number): void {
    const dialogRef = this.dialog.open(JobPositionFormComponent, {
      data: jobId,
      width: '40rem',
      height: '30rem',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.updated) {
        setTimeout(() => {
          this.fetchJobs();
        }, 500);
      }
    });
  }

  openDeleteConfirmationDialog(jobId: number): void {
    const dialogRef = this.dialog.open(DeleteConfirmationComponent, {
      width: '250px',
      data: jobId,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.deleted) {
        this.deleteJob(jobId);
      }
    });
  }

  deleteJob(jobId: number): void {
    this.jobService.deleteJobPosition(jobId).subscribe(
      (response: void) => {
        this.snackBar.open(
          'Job Position has been deleted successfully',
          'Close',
          {
            duration: 2000,
          }
        );

        this.fetchJobs();

        // Remove the deleted job from the displayed list
        const index = this.jobs.findIndex((job) => job.id === jobId);
        if (index !== -1) {
          this.jobs.splice(index, 1);
          this.pageSize = this.jobs.length;
        }

        this.dataSource = new MatTableDataSource<JobResponse>(this.jobs);
      },
      (error) => {
        this.snackBar.open(error.message, 'Close', {
          duration: 2000,
        });
      }
    );
  }

  fetchCandidateCount(jobs: JobResponse[]): void {
    jobs.forEach((element) => {
      this.jobService.getCandidateCountByJob(element.id).subscribe(
        (count: number) => {
          element.jobCount = count;
        },
        (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 2000,
          });
        }
      );
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.fetchJobs();
  }

  fetchCandidates(id: number): void {
    localStorage.clear();
    this.candidateDataService.setCandidates(id);
    this.router.navigateByUrl(`interview/jobs/${id}/candidates/search`);
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
      this.fetchJobs(sortState.active, sortState.direction);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }

  fetchJobs(
    columnName: string = 'jobTitle',
    sortDirection: string = 'asc'
  ): any {
    this.isLoading = true;

    this.jobService
      .getJobs(this.pageSize, this.pageIndex, columnName, sortDirection)
      .subscribe(
        (response) => {
          this.fetchCandidateCount(response);

          this.jobs = response;

          this.dataSource = new MatTableDataSource<JobResponse>(this.jobs);
          this.isLoading = false;
        },
        (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Close', {
            duration: 2000,
          });
          this.isLoading = false;
        }
      );
  }
}
