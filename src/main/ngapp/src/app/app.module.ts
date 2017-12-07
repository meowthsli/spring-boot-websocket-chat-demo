import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';

import { NbThemeModule, NbTabsetModule, NbUserModule, NbActionsModule } from '@nebular/theme';
import { NbSidebarModule, NbLayoutModule, NbSidebarService, NbCardModule } from '@nebular/theme';

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
    BrowserModule,
    NbLayoutModule,
    NbSidebarModule,
    NbThemeModule.forRoot({ name: 'default' }),
    RouterModule,
    NbThemeModule,
    NbCardModule,
    NbTabsetModule,
    NbUserModule,
    NbActionsModule,
  ],
  providers: [
    UsercontextService,
    StompConnector,
    ClientStompConnector,
    NbSidebarService,
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
