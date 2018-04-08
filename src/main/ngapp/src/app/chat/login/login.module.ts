import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { NbAuthModule } from '../../auth/auth.module';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      {
        path: 'chat/client/login',
        component: LoginComponent,
      },
    ]),
    NbAuthModule,
    NbCardModule,
    NbLayoutModule,
    ReactiveFormsModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule { }
