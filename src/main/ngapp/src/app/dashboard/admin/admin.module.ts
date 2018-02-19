import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { routes } from './admin.routes';
import { NbActionsModule, NbLayoutModule, NbMenuModule, NbSidebarModule, NbUserModule } from '@nebular/theme';
import { OrganizationModule } from '../../organization/organization.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NbSidebarModule,
    NbMenuModule.forRoot(),
    NbLayoutModule,
    NbActionsModule,
    NbUserModule,
    OrganizationModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
