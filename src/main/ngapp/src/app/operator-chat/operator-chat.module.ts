import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OperatorChatComponent } from './operator-chat.component';
import { RouterModule } from '@angular/router';
import { routes } from './operator-chat.routes';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [OperatorChatComponent]
})
export class OperatorChatModule { }
