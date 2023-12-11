import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { DashboardJobStatusComponent } from './components/dashboard-job-status/dashboard-job-status.component';
import { CandidateFeedbackFormComponent } from '../interview-feature/components/candidate-feedback-form/candidate-feedback-form.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardMainComponent,
  },
  {
    path: ':key/search',
    component: DashboardJobStatusComponent,
  },
  {
    path: 'feedback/:candidateId/:key',
    component: CandidateFeedbackFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardFeatureRoutingModule {}
