import { Routes } from '@angular/router';
import { SupervisorComponent } from './supervisor.component';
import { OrganizationComponent } from '../../organization/organization.component';

export const routes: Routes = [
  {
    path: 'dashboard/supervisor',
    component: SupervisorComponent,
    children: [
      {
        path: 'organization',
        component: OrganizationComponent,
        pathMatch: 'full'
      }
    ],
  },
];
