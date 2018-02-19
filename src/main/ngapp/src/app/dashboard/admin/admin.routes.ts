import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { OrganizationComponent } from '../../organization/organization.component';
import { ListComponent } from '../../organization/components/list/list.component';
import { AppGuardService } from '../../app.guard.service';

export const routes: Routes = [
  {
    path: 'dashboard/admin',
    component: AdminComponent,
    canActivate: [AppGuardService],
    children: [
      {
        path: 'organizations',
        component: ListComponent,
        pathMatch: 'full'
      },
      {
        path: 'organization/:id',
        component: OrganizationComponent,
        pathMatch: 'full'
      }
    ],
  },
];
