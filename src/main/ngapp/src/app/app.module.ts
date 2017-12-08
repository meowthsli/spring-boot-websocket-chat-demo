import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NbThemeModule, NbTabsetModule, NbUserModule, NbActionsModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbSidebarService, NbCardModule, NbSpinnerService } from '@nebular/theme';

import {ToasterService} from 'angular2-toaster';

import { AppComponent } from './app.component';
import { UsercontextService } from './app.usercontext';
import { LoginComponent } from './login/app.login';
import { ChatComponent } from './op-chat/app.chat';
import { ClientChatComponent } from './client-chat/app.client-chat';
import { ClientQueueComponent } from './op-chat/app.client-queue';
import { StompConnector } from './stomp/app.stomp';
import { ClientStompConnector } from './stomp/app.client-stomp';
import { BtoaPipe, AtobPipe } from './b64.pipe';
import { CapitalizePipe } from './pipes/capitalize';
import { TimeformatPipe } from './pipes/time-formatter';
import { ElipsisPipe } from './pipes/elipsis';
import { ToasterModule } from 'angular2-toaster/src/toaster.module';

const routes: Routes = [
  { path: '', component: LoginComponent, pathMatch: "full" },
  { path: 'ops-chat', component: ChatComponent, pathMatch: "full" },
  { path: 'clients-chat', component: ClientChatComponent, pathMatch: "full" },
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ChatComponent,
    ClientQueueComponent,
    ClientChatComponent,
    BtoaPipe,
    AtobPipe,
    CapitalizePipe,
    TimeformatPipe,
    ElipsisPipe
  ],
  imports: [
    RouterModule.forRoot(routes, {}),
    FormsModule, ReactiveFormsModule,
    BrowserModule, BrowserAnimationsModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule.forRoot({ name: 'default' }),
    RouterModule,
    NbThemeModule,
    NbCardModule,
    NbTabsetModule,
    NbUserModule,
    NbActionsModule,
    ToasterModule
  ],
  providers: [
    UsercontextService,
    StompConnector,
    ClientStompConnector,
    NbSidebarService,
    NbSpinnerService,
    ToasterService
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
