import { Routes } from '@angular/router';
import { OrganizationComponent } from './organization.component';

export const routes: Routes = [
  {
    path: 'organization',
    component: OrganizationComponent,
    pathMatch: 'full'
  },
];
