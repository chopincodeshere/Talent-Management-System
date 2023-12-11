import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JobPositionsComponent } from './components/job-positions/job-positions.component';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { CandidateFeedbackFormComponent } from './components/candidate-feedback-form/candidate-feedback-form.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';

const routes: Routes = [
  {
    path: 'jobs',
    // loadChildren: () =>
    //   import('./components/job-positions/job-positions.component').then(
    //     (mod) => mod.JobPositionsComponent
    //   ),
    component: JobPositionsComponent,
    data: {
      shouldDetach: true,
    },
  },
  {
    path: 'jobs/:jobId/candidates/search',
    component: CandidatesComponent,
    data: {
      reload: true
    },
  },
  {
    path: 'jobs/feedbacks/:candidateId',
    component: FeedbacksComponent,
    data: {
      shouldDetach: true,
    },
  },
  {
    path: 'jobs/feedback/:candidateId',
    component: CandidateFeedbackFormComponent,
    data: {
      shouldDetach: true,
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InterviewFeatureRoutingModule {}
