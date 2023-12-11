import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CandidateRegistrationFormComponent } from './components/candidate-registration-form/candidate-registration-form.component';
import { SearchCandidateComponent } from './components/search-candidate/search-candidate.component';
import { SkillsFormComponent } from './components/skills-form/skills-form.component';

const routes: Routes = [
  {
    path: 'add-candidate',
    component: CandidateRegistrationFormComponent,
    data: {
      shouldDetach: true
    }
  },
  {
    path: 'add-candidate/more-details',
    component: SkillsFormComponent,
    data: {
      shouldDetach: true
    }
  },
  {
    path: 'all-candidates/search',
    component: SearchCandidateComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class CandidatePoolFeatureRoutingModule { }
