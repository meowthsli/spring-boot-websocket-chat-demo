import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggerComponent } from './trigger.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    TriggerComponent
  ],
  exports: [
    TriggerComponent
  ]
})
export class TriggerModule { }
