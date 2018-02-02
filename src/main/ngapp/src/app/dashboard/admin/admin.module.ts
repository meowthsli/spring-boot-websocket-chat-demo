import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import { RouterModule } from '@angular/router';
import { routes } from './admin.routes';
import { NbLayoutModule, NbMenuModule, NbSidebarModule } from '@nebular/theme';
import { OrganizationModule } from '../../organization/organization.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NbSidebarModule,
    NbMenuModule.forRoot(),
    NbLayoutModule,
    OrganizationModule
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
