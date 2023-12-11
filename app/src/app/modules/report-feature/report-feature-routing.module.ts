import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReportsMainComponent } from './components/reports-main/reports-main.component';

const routes: Routes = [{ path: '', component: ReportsMainComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportFeatureRoutingModule { }
