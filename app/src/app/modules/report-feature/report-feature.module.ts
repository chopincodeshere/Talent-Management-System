import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportFeatureRoutingModule } from './report-feature-routing.module';
import { ReportsMainComponent } from './components/reports-main/reports-main.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    ReportsMainComponent
  ],
  imports: [
    CommonModule,
    ReportFeatureRoutingModule,
    MaterialModule
  ]
})
export class ReportFeatureModule { }
