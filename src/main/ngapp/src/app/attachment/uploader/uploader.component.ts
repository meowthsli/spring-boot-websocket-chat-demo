import { Component, Input, OnInit } from '@angular/core';
import { Attachment } from '../models/attachment.model';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-attachment-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  public attachment: Attachment = null;

  constructor(
    private activeModal: NgbActiveModal
  ) { }

  ngOnInit() {
  }

  public close(): void {
    this.activeModal.close(this.attachment);
  }

  public dismiss(): void {
    this.activeModal.dismiss();
  }

}
