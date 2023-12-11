import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { HttpErrorResponse } from '@angular/common/http';
import {
  Component,
  ElementRef,
  Inject,
  Optional,
  ViewChild,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatChipInputEvent, MatChipEditedEvent } from '@angular/material/chips';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { JobService } from 'src/app/services/job-service/job.service';
import { ModalService } from 'src/app/shared/services/modal.service';

@Component({
  selector: 'app-job-position-form',
  templateUrl: './job-position-form.component.html',
  styleUrls: ['./job-position-form.component.css'],
})
export class JobPositionFormComponent {
  jobPositionForm: FormGroup;
  jobTitle: string;

  isLoading: boolean = false;

  selectedFile: File;

  hiringManagersInput: string[] = [];

  addOnBlur = true;
  readonly separatorKeysCodes = [ENTER, COMMA] as const;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private jobService: JobService,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private snackBar: MatSnackBar,
    private router: Router,
    public dialogRef: MatDialogRef<JobPositionFormComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.jobPositionForm = this.formBuilder.group({
      id: [''],
      jobTitle: ['', Validators.required],
      jobStatus: ['', Validators.required],
      hiringManagers: this.formBuilder.array([], Validators.required),
      requirements: ['', Validators.required],
      jobDescription: ['', Validators.required],
    });

    this.initializeForm();
  }

  ngOnInit() {
    if (this.data) {
      this.fetchJobById();
    }
  }

  onFileSelected(event: any): void {
    try {
      this.selectedFile = event.target.files[0];

      if (this.selectedFile) {
        const reader = new FileReader();

        reader.onload = () => {
          let base64 = btoa(reader.result as string);
          this.jobPositionForm.patchValue({ jobDescription: base64 });
        };

        reader.readAsBinaryString(this.selectedFile);
      }

      const fileNameElement = document.querySelector('.file-name');
      fileNameElement!.textContent = `Selected File: ${this.selectedFile?.name}`;

      this.snackBar.open('File uploaded successfully!', 'Close', {
        duration: 2000,
      });
    } catch (error: any) {
      this.snackBar.open(error.message, 'Close', { duration: 2000 });
    }
  }

  initializeForm() {
    const hiringManagersArray = this.jobPositionForm.get(
      'hiringManagers'
    ) as FormArray;
    hiringManagersArray.clear();

    this.hiringManagersInput.forEach((manager) => {
      hiringManagersArray.push(new FormControl(manager));
    });
  }

  closeModal(): void {
    this.dialogRef.close({ updated: false });
  }

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our manager
    if (value) {
      const hiringManagersArray = this.jobPositionForm.get(
        'hiringManagers'
      ) as FormArray;

      hiringManagersArray.push(this.formBuilder.control(value));
    }

    // Clear the input value
    event.chipInput!.clear();
  }

  remove(manager: any): void {
    const hiringManagersArray = this.jobPositionForm.get(
      'hiringManagers'
    ) as FormArray;
    const index = hiringManagersArray.value.indexOf(manager);

    if (index >= 0) {
      hiringManagersArray.removeAt(index);
    }
  }

  edit(manager: any, event: MatChipEditedEvent) {
    const value = event.value.trim();

    // Remove manager if it no longer has a name
    if (!value) {
      this.remove(manager);
      console.log(this.jobPositionForm.get('hiringManagers')!.value);

      return;
    }

    // Edit existing manager
    const index = this.hiringManagersInput.indexOf(manager);
    if (index >= 0) {
      this.hiringManagersInput[index] = value;
    }
  }

  fetchJobById(): void {
    const jobId = this.data;

    this.jobService.getJobById(jobId).subscribe(
      (response) => {
        // Set form controls using response values
        this.jobPositionForm.patchValue({
          id: response.id,
          jobTitle: response.jobTitle,
          jobStatus: response.jobStatus,
          requirements: response.requirements,
          jobDescription: response.jobDescription,
        });

        const hiringManagersArray = this.jobPositionForm.get(
          'hiringManagers'
        ) as FormArray;
        hiringManagersArray.clear();

        // Set hiring managers in the FormArray
        response.hiringManagers.forEach((manager: string) => {
          hiringManagersArray.push(this.formBuilder.control(manager));
        });
      },
      (error: HttpErrorResponse) =>
        this.snackBar.open(
          'Failed to fetch job with id ' + jobId + ' due to ' + error.message,
          'Close',
          { duration: 2000 }
        )
    );
  }

  submitForm(): void {
    if (this.jobPositionForm.valid) {
      if (this.data) {
        this.isLoading = true;

        this.jobService
          .updateJob(this.data, this.jobPositionForm.value)
          .subscribe(
            (response: JobResponse) => {
              // Close the modal
              this.dialogRef.close({ updated: true });

              this.snackBar.open(
                'Job has been updated successfully.',
                'Close',
                {
                  duration: 2000,
                }
              );
              this.isLoading = false;
            },
            (error: HttpErrorResponse) => {
              this.snackBar.open(
                'Job cannot be updated due to ' + error.message,
                'Close',
                { duration: 2000 }
              );
              this.isLoading = false;
            }
          );
      } else {
        this.isLoading = true;
        this.jobService.postJob(this.jobPositionForm.value).subscribe(
          (response: JobResponse) => {
            // Close the modal
            this.dialogRef.close({ added: true });

            this.snackBar.open('Job has been added successfully.', 'Close', {
              duration: 2000,
            });

            this.isLoading = false;
          },
          (error: HttpErrorResponse) => {
            this.snackBar.open(
              'Job cannot be added due to ' + error.message,
              'Close',
              { duration: 2000 }
            );

            this.isLoading = false;
          }
        );
      }
    } else {
      Object.keys(this.jobPositionForm.controls).forEach((controlName) => {
        const control = this.jobPositionForm.get(controlName);
        if (control?.invalid) {
          control.markAsTouched();
        }
      });

      // Display an error message for invalid fields in a snackbar
      const invalidFields = Object.keys(this.jobPositionForm.controls).filter(
        (controlName) => this.jobPositionForm.controls[controlName].invalid
      );
      const errorMessage = `Invalid fields: ${invalidFields.join(', ')}`;
      this.snackBar.open(errorMessage, 'Close', {
        duration: 5000, // Duration in milliseconds
        panelClass: 'error-snackbar', // CSS class to style the snackbar as an error message
      });
    }
  }
}
