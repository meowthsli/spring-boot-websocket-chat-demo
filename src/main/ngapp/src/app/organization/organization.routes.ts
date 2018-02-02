import { Routes } from '@angular/router';
import { OrganizationComponent } from './organization.component';
import { ListComponent } from './components/list/list.component';

export const routes: Routes = [
  {
    path: 'organization/list',
    component: ListComponent,
    pathMatch: 'full'
  },
  {
    path: 'organization/:id',
    component: OrganizationComponent,
    pathMatch: 'full'
  }
];
