import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { OrganizationComponent } from './organization.component';
import { RouterModule } from '@angular/router';
import { routes } from './organization.routes';
import { OrganizationService } from './organization.service';
import { ListComponent } from './components/list/list.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    Ng2SmartTableModule,
    NbLayoutModule,
    NbCardModule
  ],
  declarations: [
    OrganizationComponent,
    ListComponent
  ],
  exports: [
    OrganizationComponent,
    ListComponent
  ],
  providers: [
    OrganizationService
  ]
})
export class OrganizationModule { }
