import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome.component';
import { RouterModule } from '@angular/router';
import { routes } from './welcome.routes';
import { NbCardModule, NbLayoutModule, NbMenuModule } from '@nebular/theme';
import { NgbButtonsModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NbMenuModule,
    NbLayoutModule,
    NbCardModule,
    NgbButtonsModule
  ],
  declarations: [WelcomeComponent]
})
export class WelcomeModule { }
