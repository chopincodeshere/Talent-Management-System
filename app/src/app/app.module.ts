import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PageNotFoundComponent } from './shared/components/page-not-found-feature/page-not-found.component';
import { NavbarComponent } from './shared/components/navbar/navbar.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './shared/services/router-reuse';
import { HttpClientModule } from '@angular/common/http';
import { JobPositionFormComponent } from './src/app/modules/interview-feature/components/job-position-form/job-position-form.component';
import { MaterialModule } from './shared/modules/material.module';
import { DeleteConfirmationComponent } from './shared/components/delete-confirmation/delete-confirmation.component';

@NgModule({
  declarations: [AppComponent, PageNotFoundComponent, NavbarComponent, JobPositionFormComponent, DeleteConfirmationComponent],
  imports: [
    BrowserModule,
    MaterialModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    NgbModule,
    FormsModule,
    HttpClientModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
