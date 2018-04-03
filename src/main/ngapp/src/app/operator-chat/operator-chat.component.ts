import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from './services/chat.service';
import { Observable } from 'rxjs/Observable';
import { Queue } from './models/queue.model';
import { Chat } from './models/chat.model';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';
import { FormControl } from '@angular/forms';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { ToasterConfig } from 'angular2-toaster';
import { Attachment } from '../attachment/models/attachment.model';
import { UploaderService } from '../attachment/uploader/uploader.service';

@Component({
  selector: 'app-operator-chat',
  templateUrl: './operator-chat.component.html',
  styleUrls: ['./operator-chat.component.scss']
})
export class OperatorChatComponent implements OnInit, OnDestroy {

  @ViewChild('messagesContainer')
  public messagesContainer: ElementRef;

  public freeChatsSearchQuery: FormControl = new FormControl('');

  public freeChatsStream: Observable<Queue> = combineLatest(
    this.chatter.syncFreeChats(),
    this.freeChatsSearchQuery.valueChanges.startWith(''),
    (queue: Queue, query: string) => queue.filterChats(query)
  );
  public freeChats: Queue = null;

  public myChatsStream: Observable<Queue> = this.chatter.syncMyChats();
  public myChats: Queue = null;

  public chat: Chat = null;
  public subscription: Subscription = null;

  public readonly toasterConfig = new ToasterConfig({
    showCloseButton: false,
    tapToDismiss: true,
    timeout: 0,
    limit: 1,
  });

  constructor(
    private chatter: ChatService,
    private uploader: UploaderService
  ) {

  }

  public ngOnInit(): void {
    this.chatter.connect();

    this.subscription = this.chatter.syncSelectedChat()
      .subscribe(chat => {
        this.chat = chat;
        this.onScrollDown();
      });

    this.freeChatsStream.subscribe(queue => {
      this.freeChats = queue;
      this.onScrollDown();
    });
    this.myChatsStream.subscribe(queue => {
      this.myChats = queue;
      this.onScrollDown();
    });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  /**
   * Выбор текущего чата
   *
   * @param {Chat} chat
   */
  public onSelectChat(chat: Chat): void {
    this.chatter.selectChat(chat);
  }

  /**
   * Отправка сообщения
   *
   * @param {string} text
   */
  public onSendMessage(text: string): void {
    if (text && text.trim()) {
      this.chatter.sendMessage(this.chat.id, text.trim());
      this.onScrollDown();
    }
  }

  /**
   * Отпустить клиента
   */
  public onRelease(): void {
    this.chatter.removeChat(this.chat);
    this.chat = null;
  }

  /**
   * Проверка доступности кнопки "Отпустить клиента"
   *
   * @param {Chat} chat
   * @returns {boolean}
   */
  public canReleaseClent(chat: Chat): boolean {
    return chat.operatorId === '1';
  }

  /**
   * Upload Attachment
   *
   * @param {Attachment} attachment
   */
  public onFileUpload(attachment: Attachment): void {
    this.uploader.confirm(attachment)
      .then(a => {
        this.chatter.sendFile(this.chat.id, attachment.data, attachment.filename);
      })
      .catch(cancel => {

      });
  }

  /**
   * Прокрутка списка сообщений
   */
  public onScrollDown(): void {
    setTimeout(() =>  {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }

}
