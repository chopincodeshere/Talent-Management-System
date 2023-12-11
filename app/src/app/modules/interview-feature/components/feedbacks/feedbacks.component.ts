import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateFeedback } from 'src/app/core/models/CandidateFeedback';
import { JobResponse } from 'src/app/core/models/JobResponse';
import { CandidateService } from 'src/app/services/candidate-service/candidate.service';
import { JobService } from 'src/app/services/job-service/job.service';
import { CandidateDataService } from 'src/app/shared/services/candidate-data.service';

@Component({
  selector: 'app-feedbacks',
  templateUrl: './feedbacks.component.html',
  styleUrls: ['./feedbacks.component.css'],
})
export class FeedbacksComponent {
  candidateFeedbacks: CandidateFeedback[];
  candidateId: number;
  jobId: number;
  numberOfFeedbacks: number;

  positions: JobResponse[];
  jobTitles: string[];
  results: string[] = [
    'Shortlisted',
    'On hold',
    'Rejected - Below the average rating - but can be approached in Future',
    'Rejected - Poor Rating',
  ];
  candidateResult: string;

  constructor(
    private candidateService: CandidateService,
    private route: ActivatedRoute,
    private jobService: JobService,
    private router: Router,
    private candidateDataService: CandidateDataService
  ) {}

  ngOnInit() {
    this.fetchJobs();
    this.setCandidateId();
    this.fetchFeedbacks();
    this.setJobId();
  }

  setJobId(): void {
    this.jobId = this.candidateDataService.getJob();
  }

  routeBack(): void {
    this.router.navigateByUrl(
      `/interview/jobs/${this.jobId}/candidates/search?collapseRows=true`
    );
  }

  setCandidateId() {
    this.route.params.subscribe((params) => {
      this.candidateId = params['candidateId'];
    });
  }

  openFeedbackForm(): void {
    this.router.navigateByUrl(`/interview/jobs/feedback/${this.candidateId}`);
  }

  fetchFeedbacks() {
    this.candidateService.getCandidateFeedback(this.candidateId).subscribe(
      (response) => {
        this.candidateFeedbacks = response;

        this.numberOfFeedbacks = response.length;
      },
      (error) => console.log(error)
    );
  }

  fetchJobs() {
    this.jobService.getJobs().subscribe(
      (response) => {
        this.jobTitles = response.map((job) => job.jobTitle);
      },
      (error: HttpErrorResponse) => alert(error)
    );
  }
}
