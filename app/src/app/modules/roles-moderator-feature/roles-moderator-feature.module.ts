import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesModeratorFeatureRoutingModule } from './roles-moderator-feature-routing.module';
import { RolesComponent } from './components/roles/roles.component';
import { MaterialModule } from 'src/app/shared/modules/material.module';


@NgModule({
  declarations: [
    RolesComponent
  ],
  imports: [
    CommonModule,
    RolesModeratorFeatureRoutingModule,
    MaterialModule
  ]
})
export class RolesModeratorFeatureModule { }
