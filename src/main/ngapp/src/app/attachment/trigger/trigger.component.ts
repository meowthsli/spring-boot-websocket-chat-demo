import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Attachment } from '../models/attachment.model';

@Component({
  selector: 'app-attachment-trigger',
  templateUrl: './trigger.component.html',
  styleUrls: ['./trigger.component.scss']
})
export class TriggerComponent implements OnInit {

  @Output()
  public onUpload: EventEmitter<Attachment> = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  public onFileSelect(files: FileList): void {
    const fileReader = new FileReader();
    fileReader.onload = fileLoadedEvent => {
      const data = fileLoadedEvent['target']['result'];
      this.onUpload.emit(new Attachment(files.item(0).name, data));
    };
    fileReader.readAsDataURL(files.item(0));
  }

}
