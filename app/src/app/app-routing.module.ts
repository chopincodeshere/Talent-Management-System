import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PageNotFoundComponent } from './shared/components/page-not-found-feature/page-not-found.component';

const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./modules/dashboard-feature/dashboard-feature.module').then(
        (mod) => mod.DashboardFeatureModule
      ),
    
  },
  {
    path: 'candidate-pool',
    loadChildren: () =>
      import(
        './modules/candidate-pool-feature/candidate-pool-feature.module'
      ).then((mod) => mod.CandidatePoolFeatureModule),
    
  },
  {
    path: 'interview',
    loadChildren: () =>
      import('./modules/interview-feature/interview-feature.module').then(
        (mod) => mod.InterviewFeatureModule
      ),
    
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('./modules/report-feature/report-feature.module').then(
        (mod) => mod.ReportFeatureModule
      ),
    
  },
  {
    path: 'register',
    loadChildren: () =>
      import(
        './modules/registration/registration.module'
      ).then((mod) => mod.RegistrationModule),
    
  },
  {
    path: 'roles',
    loadChildren: () =>
      import(
        './modules/roles-moderator-feature/roles-moderator-feature.module'
      ).then((mod) => mod.RolesModeratorFeatureModule),
    
  },
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
