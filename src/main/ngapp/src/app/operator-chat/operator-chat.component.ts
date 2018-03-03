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
  public selectedChat: BehaviorSubject<Chat> = new BehaviorSubject(null);
  public subscription: Subscription = null;

  public readonly toasterConfig = new ToasterConfig({
    showCloseButton: false,
    tapToDismiss: true,
    timeout: 0,
    limit: 1,
  });

  constructor(
    private chatter: ChatService
  ) {

  }

  public ngOnInit(): void {
    this.chatter.connect();

    this.subscription = this.selectedChat.asObservable()
      .switchMap(selectedChat => this.chatter.syncChat(selectedChat && selectedChat.id))
      .subscribe(chat => {
        this.chat = chat;
        if (this.chat) {
          this.onScrollDown();
        }
      });

    this.freeChatsStream.subscribe(queue => this.freeChats = queue);
    this.myChatsStream.subscribe(queue => this.myChats = queue);
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
    this.selectedChat.next(chat);
  }

  /**
   * Отправка сообщения
   *
   * @param {string} text
   */
  public onSendMessage(text: string): void {
    if (text && text.trim()) {
      this.chat.appendMessage(text.trim());
      if ( ! this.chat.operatorId) {
        this.myChats.prependChat(this.chat.assignOperator('1'));
        this.freeChats.removeChat(this.chat);
      }
      this.onScrollDown();
    }
  }

  /**
   * Отпустить клиента
   */
  public onRelease(): void {
    this.myChats.removeChat(this.chat);
    this.chat = null; // TODO: Отпустить клиента
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
   * Прокрутка списка сообщений
   */
  public onScrollDown(): void {
    setTimeout(() =>  {
      this.messagesContainer.nativeElement.scrollTop = this.messagesContainer.nativeElement.scrollHeight;
    }, 0);
  }

}
