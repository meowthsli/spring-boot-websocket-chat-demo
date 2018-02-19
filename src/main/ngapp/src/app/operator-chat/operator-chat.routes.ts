import { Routes } from '@angular/router';
import { OperatorChatComponent } from './operator-chat.component';
import { AppGuardService } from '../app.guard.service';

export const routes: Routes = [
  {
    path: 'chat/operator',
    component: OperatorChatComponent,
    canActivate: [AppGuardService]
  },
];
