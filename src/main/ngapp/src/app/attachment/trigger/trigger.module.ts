import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TriggerComponent } from './trigger.component';
import { UploaderModule } from '../uploader/uploader.module';

@NgModule({
  imports: [
    CommonModule,
    UploaderModule
  ],
  declarations: [
    TriggerComponent
  ],
  exports: [
    TriggerComponent
  ]
})
export class TriggerModule { }
