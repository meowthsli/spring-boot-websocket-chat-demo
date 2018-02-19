import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { routes } from './supervisor.routes';
import { RouterModule } from '@angular/router';
import { SupervisorComponent } from './supervisor.component';
import { NbActionsModule, NbLayoutModule, NbMenuModule, NbUserModule } from '@nebular/theme';
import { OrganizationModule } from '../../organization/organization.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NbMenuModule,
    NbLayoutModule,
    NbActionsModule,
    NbUserModule,
    OrganizationModule
  ],
  declarations: [
    SupervisorComponent
  ]
})
export class SupervisorModule { }
