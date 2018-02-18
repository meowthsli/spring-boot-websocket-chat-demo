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
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap/modal/modal';
import { NgbModalStack } from '@ng-bootstrap/ng-bootstrap/modal/modal-stack';
import { ProfileComponent } from './op-chat/app.profile';
import { FioPipeSimple } from './pipes/fio-pipe-simple';
import { SettingsComponent } from './op-chat/app.management';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

import { OUChatClientConnector } from './ou-chat-sdk/client-connector';
import { NbAuthModule } from './auth/auth.module';
import { NbEmailPassAuthProvider } from './auth/providers/email-pass-auth.provider';
import { OrganizationModule } from './organization/organization.module';
import { SupervisorModule } from './dashboard/supervisor/supervisor.module';
import { AdminModule } from './dashboard/admin/admin.module';
import { OperatorChatModule } from './operator-chat/operator-chat.module';
import { PipesModule } from './pipes/pipes.module';
import { OUChatClientConnectorImpl } from './connectors-gen-1.0-SNAPSHOT/org/wolna/ouchat/impl/client-connector';
import { ChatModule } from './chat/chat.module';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  { path: 'login', component: LoginComponent, pathMatch: "full" },
  { path: 'ops-chat', component: ChatComponent, pathMatch: "full" },
  { path: 'clients-chat', component: ClientChatComponent, pathMatch: "full" }
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
    ProfileComponent,
    SettingsComponent,
  ],
  entryComponents: [ProfileComponent, SettingsComponent],
  imports: [
    RouterModule.forRoot(routes, {}),
    FormsModule, ReactiveFormsModule,
    BrowserModule, BrowserAnimationsModule,
    RouterModule,
    NbLayoutModule, NbSidebarModule, NbThemeModule, NbCardModule, NbTabsetModule, NbUserModule, NbActionsModule, NgbModalModule,
    NbThemeModule.forRoot({ name: 'default' }),
    InfiniteScrollModule,
    ToasterModule,
    PipesModule,
    OrganizationModule,
    SupervisorModule,
    AdminModule,
    ChatModule,
    OperatorChatModule,

    NbAuthModule.forRoot({
      forms: {
        login: {
          redirectDelay: 3000,
        },
      },
      providers: {
        //
        // email: {
        //   service: NbDummyAuthProvider,
        //   config: {
        //     alwaysFail: true,
        //     delay: 1000,
        //   },
        // },
        email: {
          service: NbEmailPassAuthProvider,
          config: {
            login: {
              endpoint: 'http://localhost:8080/api/login'
            },
            register: {
              endpoint: 'http://localhost:8080/api/register'
            },
            logout: {
              endpoint: 'http://localhost:8080/api/logout',
              redirect: {
                success: '/auth/login',
                failure: '/auth/login',
              },
            },
            requestPass: {
              endpoint: 'http://localhost:8080/api/request-pass',
              redirect: {
                success: '/auth/reset-password',
              },
            },
            resetPass: {
              endpoint: 'http://localhost:8080/api/reset-pass',
              redirect: {
                success: '/auth/login',
              },
            },
          },
        },
      },
    }),
  ],
  providers: [
    UsercontextService, OUChatClientConnectorImpl,
    StompConnector,
    ClientStompConnector,
    NbSidebarService,
    NbSpinnerService,
    ToasterService,
    NgbModalStack
  ],
  bootstrap: [
    AppComponent
  ]
})
export class AppModule { }
