import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ExportToExcelService } from 'src/app/services/exportToExcel-service/exportToExcel.service';

@Component({
  selector: 'app-reports-main',
  templateUrl: './reports-main.component.html',
  styleUrls: ['./reports-main.component.css'],
})
export class ReportsMainComponent {
  selectedFile: File | null;
  isFileSelected: boolean = false;
  uploadingFile: boolean = false;
  downloadingFile: {
    allCandidate: boolean;
    jobPositions: boolean;
    candidateFeedback: boolean;
    sampleExcel: boolean;
  } = {
    allCandidate: false,
    jobPositions: false,
    candidateFeedback: false,
    sampleExcel: false,
  };

  constructor(
    private exportService: ExportToExcelService,
    private snackBar: MatSnackBar
  ) {}

  exportAllCandidatesData(): void {
    this.downloadingFile.allCandidate = true;

    this.exportService.exportAllCandidatesData().subscribe(
      (response: BlobPart) => {
        const blob = new Blob([response], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'All Candidates data.xlsx';
        a.click();
        window.URL.revokeObjectURL(url);
        this.downloadingFile.allCandidate = false;
      },
      (error: HttpErrorResponse) => {
        this.downloadingFile.allCandidate = false;
        console.log(error);
        
        if (error.status === 500) {
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
  }

  exportJobPositionsData(): void {
    this.downloadingFile.jobPositions = true;

    this.exportService.exportJobPositionsData().subscribe(
      (response: BlobPart) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Job Positions data.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadingFile.jobPositions = false;
      },
      (error: HttpErrorResponse) => {
        this.downloadingFile.jobPositions = false;
        if (error.status === 500) {
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
  }

  exportCandidateFeedbackData(): void {
    this.downloadingFile.candidateFeedback = true;

    this.exportService.exportCandidateFeedbackData().subscribe(
      (response: BlobPart) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'Candidate Feedback data.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);
        this.downloadingFile.candidateFeedback = false;
      },
      (error: HttpErrorResponse) => {
        this.downloadingFile.candidateFeedback = false;
        if (error.status === 500) {
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
  }

  exportSampleExcelFile(): void {
    this.downloadingFile.sampleExcel = true;
    this.exportService.exportSampleExcelFile().subscribe(
      (response: BlobPart) => {
        const blob = new Blob([response], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'SampleExcel.xlsx';
        link.click();
        window.URL.revokeObjectURL(url);

        this.downloadingFile.sampleExcel = false;
      },
      (error: HttpErrorResponse) => {
        this.downloadingFile.sampleExcel = false;

        if (error.status === 500) {
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
  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
    const fileNameElement = document.getElementById('file-name');
    fileNameElement!.textContent = `Selected File: ${this.selectedFile?.name}`;
    this.isFileSelected = true;
  }

  resetFileInput(): void {
    const fileInput = document.getElementById('file-input') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadFile(): void {
    if (!this.selectedFile) {
      this.snackBar.open('Please select a file', 'Close', {
        duration: 2000,
      });
      return;
    }

    if (this.uploadingFile) {
      this.snackBar.open(
        'Please wait until the current file is uploaded',
        'Close',
        {
          duration: 2000,
        }
      );
      return;
    }

    this.uploadingFile = true;

    this.exportService.uploadFile(this.selectedFile).subscribe(
      (response) => {
        this.snackBar.open('File Uploaded Successfully!', 'Close', {
          duration: 2000,
        });

        this.selectedFile = null;
        const fileNameElement = document.getElementById('file-name');
        fileNameElement!.textContent = ``;

        this.isFileSelected = false;
        this.resetFileInput();
        setTimeout(() => {
          this.uploadingFile = false;
        }, 1000);
      },
      (error) => {
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
        this.uploadingFile = false;
      }
    );
  }
}
