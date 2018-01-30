import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbThemeModule, NbCardModule, NbMenuModule, NbLayoutModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OrganizationComponent } from './organization.component';
import { RouterModule } from '@angular/router';
import { routes } from './organization.routes';
import { OrganizationService } from './organization.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    NbCardModule,
    NbMenuModule,
    NbLayoutModule
  ],
  declarations: [
    OrganizationComponent
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationModule { }
