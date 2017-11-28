import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatGridListModule, MatIcon} from '@angular/material';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from './app.component';
import { LoginComponent } from './app.login';
import { ChatComponent } from './app.chat';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'chat', component: ChatComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent
  ],
  imports: [
    RouterModule.forRoot(routes, {}),
    FormsModule,
    BrowserModule,
    NoopAnimationsModule,
    MatGridListModule,

    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatIconModule
  ],
  providers: [],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
