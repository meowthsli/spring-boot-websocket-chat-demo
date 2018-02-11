import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Queue } from '../../models/queue.model';
import { Chat } from '../../models/chat.model';

@Component({
  selector: 'app-client-queue',
  templateUrl: './client-queue.component.html',
  styleUrls: ['./client-queue.component.scss']
})
export class ClientQueueComponent implements OnInit {

  @Input()
  public readonly queue: Queue;
  @Input()
  public readonly currentChat: Chat;

  @Output()
  public readonly onSelectChat: EventEmitter<Chat> = new EventEmitter();

  constructor (

  ) {

  }

  public ngOnInit(): void {

  }

}
