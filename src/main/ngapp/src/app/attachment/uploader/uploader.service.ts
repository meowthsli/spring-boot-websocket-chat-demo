import { Injectable } from '@angular/core';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { UploaderComponent } from './uploader.component';
import { Attachment } from '../models/attachment.model';

@Injectable()
export class UploaderService {

  constructor(private modal: NgbModal) { }

  public confirm(attachment: Attachment): Promise<any> {
    const modalRef: NgbModalRef = this.modal.open(UploaderComponent);
    modalRef.componentInstance.attachment = attachment;
    return modalRef.result
  }

}
