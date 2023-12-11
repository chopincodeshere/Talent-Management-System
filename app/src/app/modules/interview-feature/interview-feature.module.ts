import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { InterviewFeatureRoutingModule } from './interview-feature-routing.module';
import { JobPositionsComponent } from './components/job-positions/job-positions.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { JobPositionFormComponent } from './components/job-position-form/job-position-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CandidatesComponent } from './components/candidates/candidates.component';
import { EditCandidateFormComponent } from './components/edit-candidate-form/edit-candidate-form.component';
import { CandidateFeedbackFormComponent } from './components/candidate-feedback-form/candidate-feedback-form.component';
import { StarRatingComponent } from './components/star-rating/star-rating.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { InterviewerNoteComponent } from './components/interviewer-note/interviewer-note.component';
import { EmailFormComponent } from './components/email-form/email-form.component';
import { FeedbacksComponent } from './components/feedbacks/feedbacks.component';
import { BoxRatingComponent } from './components/box-rating/box-rating.component';

console.log("Interview module loaded");

@NgModule({
  declarations: [
    JobPositionsComponent,
    JobPositionFormComponent,
    CandidatesComponent,
    EditCandidateFormComponent,
    CandidateFeedbackFormComponent,
    StarRatingComponent,
    InterviewerNoteComponent,
    EmailFormComponent,
    FeedbacksComponent,
    BoxRatingComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    InterviewFeatureRoutingModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    SearchModule
  ],
})
export class InterviewFeatureModule {}
