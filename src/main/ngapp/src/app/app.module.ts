import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NbThemeModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbSidebarService } from '@nebular/theme';

import { AppComponent } from './app.component';
import { UsercontextService } from './app.usercontext';
import { LoginComponent } from './login/app.login';
//import { ChatComponent } from './op-chat/app.chat';
//import { ClientChatComponent } from './client-chat/app.client-chat';
//import { ClientQueueComponent } from './op-chat/app.client-queue';
//import { StompConnector } from './stomp/app.stomp';
//import { ClientStompConnector } from './stomp/app.client-stomp';

const routes: Routes = [
  { path: '', component: LoginComponent },
  /*{ path: 'ops-chat', component: ChatComponent },
  { path: 'clients-chat', component: ClientChatComponent },
  */
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // ChatComponent,
    // ClientQueueComponent,
    // ClientChatComponent,
  ],
  imports: [
    RouterModule.forRoot(routes, {}),
    FormsModule, ReactiveFormsModule,
    BrowserModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule.forRoot({ name: 'default' }),
    RouterModule,
    NbThemeModule,
  ],
  providers: [
    UsercontextService,
    // StompConnector,
    // ClientStompConnector,
    NbSidebarService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
