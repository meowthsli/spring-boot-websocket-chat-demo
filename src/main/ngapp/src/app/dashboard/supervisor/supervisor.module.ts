import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from './supervisor.routes';
import { RouterModule } from '@angular/router';
import { SupervisorComponent } from './supervisor.component';
import { NbLayoutModule, NbMenuModule } from '@nebular/theme';
import { OrganizationModule } from '../../organization/organization.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NbMenuModule,
    NbLayoutModule,
    OrganizationModule
  ],
  declarations: [
    SupervisorComponent
  ]
})
export class SupervisorModule { }
