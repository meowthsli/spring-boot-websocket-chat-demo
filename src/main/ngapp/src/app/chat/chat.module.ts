import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import { NbCardModule, NbLayoutModule } from '@nebular/theme';
import { ToasterModule } from 'angular2-toaster';
import { RouterModule } from '@angular/router';
import { routes } from './chat.routes';
import { PipesModule } from '../pipes/pipes.module';
import { FormsModule } from '@angular/forms';
import { OUChatClientConnectorImpl } from '../connectors-gen-1.0-SNAPSHOT/org/wolna/ouchat/impl/client-connector';
import { TriggerModule } from '../attachment/trigger/trigger.module';
import { UploaderModule } from '../attachment/uploader/uploader.module';
import { MessageModule } from '../attachment/message/message.module';
import { LoginModule } from './login/login.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NbLayoutModule,
    NbCardModule,
    ToasterModule,
    PipesModule,
    TriggerModule,
    UploaderModule,
    MessageModule,
    LoginModule
  ],
  declarations: [ChatComponent],
  providers: [
    OUChatClientConnectorImpl
  ]
})
export class ChatModule { }
