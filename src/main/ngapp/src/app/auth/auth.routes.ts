/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Routes } from '@angular/router';

import { NbAuthComponent } from './components/auth.component';
import { NbLoginComponent } from './components/login/login.component';
import { NbRegisterComponent } from './components/register/register.component';
import { NbLogoutComponent } from './components/logout/logout.component';
import { NbRequestPasswordComponent } from './components/request-password/request-password.component';
import { NbResetPasswordComponent } from './components/reset-password/reset-password.component';

export const routes: Routes = [
  {
    path: 'auth',
    component: NbAuthComponent,
    children: [
      {
        path: '',
        component: NbLoginComponent,
        pathMatch: 'full'
      },
      {
        path: 'login',
        component: NbLoginComponent,
        pathMatch: 'full'
      },
      {
        path: 'register',
        component: NbRegisterComponent,
        pathMatch: 'full'
      },
      {
        path: 'logout',
        component: NbLogoutComponent,
        pathMatch: 'full'
      },
      {
        path: 'request-password',
        component: NbRequestPasswordComponent,
        pathMatch: 'full'
      },
      {
        path: 'reset-password',
        component: NbResetPasswordComponent,
        pathMatch: 'full'
      },
    ],
  },
];
