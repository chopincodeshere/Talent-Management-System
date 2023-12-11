import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { JobService } from 'src/app/services/job-service/job.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CandidateFeedback } from 'src/app/core/models/CandidateFeedback';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-candidate-feedback-form',
  templateUrl: './candidate-feedback-form.component.html',
  styleUrls: ['./candidate-feedback-form.component.css'],
})
export class CandidateFeedbackFormComponent {
  candidateFeedbackForm: FormGroup;
  resetRatings: boolean;

  maxDate: Date = new Date();
  
  url: string;

  jobTitles: string[];
  results: string[] = [
    'Shortlisted',
    'On hold',
    'Rejected - Below the average rating - but can be approached in Future',
    'Rejected - Poor Rating',
  ];
  candidateResult: string;
  candidateId: number;
  key: number;

  job_id: number;

  constructor(
    private candidateService: CandidateService,
    private jobService: JobService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar
  ) {
    this.candidateFeedbackForm = this.formBuilder.group({
      candidateName: ['', Validators.required],
      dateOfInterview: ['', Validators.required],
      positionAppliedFor: ['', Validators.required],
      interviewer: ['', Validators.required],
      educationalBackgroundRating: ['', Validators.required],
      workExperienceRating: ['', Validators.required],
      technicalSkillsRating: ['', Validators.required],
      communicationSkillsRating: ['', Validators.required],
      candidateInterestRating: ['', Validators.required],
      interpersonalSkillsRating: ['', Validators.required],
      overallRating: ['', Validators.required],
      comments: [''],
      result: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.fetchJobs();

    this.route.url.forEach((e) => (this.url = e[0].path));

    this.route.params.subscribe((params) => {
      this.candidateId = params['candidateId'];
      params['key'] ? (this.key = params['key']) : null;
      this.fetchCandidateName(this.candidateId);
      this.fetchCandidatePosition(this.candidateId);
    });
  }

  fetchJobs() {
    this.jobService.getJobs().subscribe(
      (response) => {
        this.jobTitles = response.map((position) => position.jobTitle);
      },
      (error: HttpErrorResponse) => alert(error)
    );
  }

  fetchCandidateName(candidateId: number): void {
    this.candidateService.getCandidateName(candidateId).subscribe(
      (candidateName: string) => {
        this.candidateFeedbackForm.patchValue({
          candidateName: candidateName, // Set the candidate's name in the form
        });
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
          this.snackBar.open(`Error code: ${error.status}`, 'Close', {
            duration: 2000,
          });
        }
      }
    );
  }

  fetchCandidatePosition(candidateId: number): void {
    this.candidateService.getCandidatePosition(candidateId).subscribe(
      (response: number) => {
        this.job_id = response;

        this.candidateFeedbackForm.patchValue({
          positionAppliedFor: response,
        });
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
          this.snackBar.open(`Error code: ${error.status}`, 'Close', {
            duration: 2000,
          });
        }
      }
    );
  }

  submitFeedback(): void {
    console.log(this.candidateFeedbackForm.value);

    if (this.candidateFeedbackForm.valid) {
      const candidateFeedback: CandidateFeedback =
        this.candidateFeedbackForm.value;
      this.candidateService
        .addCandidateFeedback(this.candidateId, candidateFeedback)
        .subscribe(
          (response: CandidateFeedback) => {
            this.candidateFeedbackForm.reset();
            this.snackBar.open(
              'Your Feedback is added successfully!',
              'Close',
              { duration: 2000 }
            );

            this.navigateBack();
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
              this.snackBar.open(`Error code: ${error.status}`, 'Close', {
                duration: 2000,
              });
            }
          }
        );
    } else {
      Object.keys(this.candidateFeedbackForm.controls).forEach(
        (controlName) => {
          const control = this.candidateFeedbackForm.get(controlName);
          if (control?.invalid) {
            control.markAsTouched();
          }
        }
      );

      // Display an error message for invalid fields in a snackbar
      const invalidFields = Object.keys(
        this.candidateFeedbackForm.controls
      ).filter(
        (controlName) =>
          this.candidateFeedbackForm.controls[controlName].invalid
      );
      const errorMessage = `Invalid fields: ${invalidFields.join(', ')}`;
      this.snackBar.open(errorMessage, 'Close', {
        duration: 6000,
        panelClass: 'error-snackbar',
      });
    }
  }

  navigateBack(): void {
    if (this.url === 'jobs') {
      this.router.navigateByUrl(
        `/interview/jobs/${this.job_id}/candidates/search`
      );
    } else {
      this.router.navigateByUrl(`/dashboard/${this.key}`);
    }
  }
}
