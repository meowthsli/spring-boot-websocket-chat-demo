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

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    NbLayoutModule,
    NbCardModule,
    ToasterModule,
    PipesModule
  ],
  declarations: [ChatComponent],
  providers: [
    OUChatClientConnectorImpl
  ]
})
export class ChatModule { }
