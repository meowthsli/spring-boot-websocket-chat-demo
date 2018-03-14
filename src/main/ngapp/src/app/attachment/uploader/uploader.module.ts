import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploaderComponent } from './uploader.component';
import { NgbButtonsModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { UploaderService } from './uploader.service';

@NgModule({
  imports: [
    CommonModule,
    NgbModalModule,
    NgbButtonsModule
  ],
  declarations: [
    UploaderComponent
  ],
  exports: [
    UploaderComponent
  ],
  entryComponents: [
    UploaderComponent
  ],
  providers: [
    UploaderService
  ]
})
export class UploaderModule { }
