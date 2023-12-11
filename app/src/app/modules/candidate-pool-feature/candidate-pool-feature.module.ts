import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CandidatePoolFeatureRoutingModule } from './candidate-pool-feature-routing.module';

import { CandidateRegistrationFormComponent } from './components/candidate-registration-form/candidate-registration-form.component';
import { SkillsFormComponent } from './components/skills-form/skills-form.component';
import { SearchCandidateComponent } from './components/search-candidate/search-candidate.component';
import { ResumeUploadComponent } from './components/candidate-registration-form/subcomponents/resume-upload/resume-upload.component';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { EmploymentComponent } from './components/candidate-registration-form/subcomponents/employment/employment.component';
import { LinksComponent } from './components/candidate-registration-form/subcomponents/links/links.component';
import { EducationComponent } from './components/candidate-registration-form/subcomponents/education/education.component';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { EditCandidateAllFormComponent } from './components/edit-candidate-all-form/edit-candidate-all-form.component';

console.log('Candidate registration module loaded');

@NgModule({
  declarations: [
    CandidateRegistrationFormComponent,
    SkillsFormComponent,
    SearchCandidateComponent,
    ResumeUploadComponent,
    EmploymentComponent,
    LinksComponent,
    EducationComponent,
    EditCandidateAllFormComponent,
  ],
  imports: [
    CommonModule,
    CandidatePoolFeatureRoutingModule,
    MaterialModule,
    FormsModule,
    NgMultiSelectDropDownModule,
    ReactiveFormsModule,
    HttpClientModule,
    SearchModule,
    PdfViewerModule
  ],
  providers: [HttpClient],
})
export class CandidatePoolFeatureModule {}
