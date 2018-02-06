import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorChatComponent } from './operator-chat.component';
import { RouterModule } from '@angular/router';
import { routes } from './operator-chat.routes';
import { ToasterModule } from 'angular2-toaster';
import { NbActionsModule, NbCardModule, NbLayoutModule, NbTabsetModule, NbUserModule } from '@nebular/theme';
import { ClientQueueComponent } from './components/client-queue/client-queue.component';
import { FioPipeSimple } from '../pipes/fio-pipe-simple';
import { PipesModule } from '../pipes/pipes.module';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    FormsModule,
    ToasterModule,
    NbActionsModule,
    NbLayoutModule,
    NbCardModule,
    NbTabsetModule,
    NbUserModule,
    InfiniteScrollModule,
    PipesModule
  ],
  declarations: [
    OperatorChatComponent,
    ClientQueueComponent
  ]
})
export class OperatorChatModule { }
