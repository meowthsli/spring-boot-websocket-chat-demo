import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatGridListModule, MatIcon, MatListModule, MatTabsModule} from '@angular/material';
import {MatButtonModule, MatCheckboxModule} from '@angular/material';
import {MatCardModule} from '@angular/material/card';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';

import { AppComponent } from './app.component';
import { UsercontextService } from './app.usercontext';
import { LoginComponent } from './login/app.login';
import { ChatComponent } from './op-chat/app.chat';
import { ClientChatComponent } from './client-chat/app.client-chat';
import { ClientQueueComponent } from './op-chat/app.client-queue';
import { StompConnector } from './stomp/app.stomp';
import { ClientStompConnector } from './stomp/app.client-stomp';

const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'ops-chat', component: ChatComponent },
  { path: 'clients-chat', component: ClientChatComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ClientQueueComponent,
    ClientChatComponent,
  ],
  imports: [
    RouterModule.forRoot(routes, {}),
    FormsModule, ReactiveFormsModule,
    BrowserModule,
    NoopAnimationsModule,
    MatGridListModule,

    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatInputModule,
    MatIconModule,
    MatListModule,
    MatTabsModule,
  ],
  providers: [
    UsercontextService,
    StompConnector,
    ClientStompConnector,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
