import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardFeatureRoutingModule } from './dashboard-feature-routing.module';
import { DashboardMainComponent } from './components/dashboard-main/dashboard-main.component';
import { StatCardsComponent } from './components/stat-cards/stat-cards.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';
import { DashboardJobStatusComponent } from './components/dashboard-job-status/dashboard-job-status.component';
import { SearchModule } from 'src/app/shared/modules/search/search.module';
import { InterviewFeatureModule } from '../interview-feature/interview-feature.module';

console.log("Dashboard module loaded");

@NgModule({
  declarations: [
    DashboardMainComponent,
    StatCardsComponent,
    DashboardJobStatusComponent,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    DashboardFeatureRoutingModule,
    SearchModule,
  ],
})
export class DashboardFeatureModule {}
