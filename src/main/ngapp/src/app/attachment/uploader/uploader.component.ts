import { Component, Input, OnInit } from '@angular/core';
import { Attachment } from '../models/attachment.model';

@Component({
  selector: 'app-attachment-uploader',
  templateUrl: './uploader.component.html',
  styleUrls: ['./uploader.component.scss']
})
export class UploaderComponent implements OnInit {

  @Input()
  public model: Attachment;

  constructor() { }

  ngOnInit() {
  }

}
