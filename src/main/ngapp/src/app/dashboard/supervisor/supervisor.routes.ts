import { Routes } from '@angular/router';
import { SupervisorComponent } from './supervisor.component';
import { OrganizationComponent } from '../../organization/organization.component';
import { AppGuardService } from '../../app.guard.service';

export const routes: Routes = [
  {
    path: 'dashboard/supervisor',
    component: SupervisorComponent,
    canActivate: [AppGuardService],
    children: [
      {
        path: 'organization',
        component: OrganizationComponent,
        pathMatch: 'full'
      }
    ],
  },
];
