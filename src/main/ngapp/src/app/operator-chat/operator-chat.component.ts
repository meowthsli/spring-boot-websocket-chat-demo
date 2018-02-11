import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { ChatService } from './services/chat.service';
import { Observable } from 'rxjs/Observable';
import { Queue } from './models/queue.model';
import { Chat } from './models/chat.model';
import { Subscription } from 'rxjs/Subscription';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/switchMap';

@Component({
  selector: 'app-operator-chat',
  templateUrl: './operator-chat.component.html',
  styleUrls: ['./operator-chat.component.scss']
})
export class OperatorChatComponent implements OnInit, OnDestroy {

  @ViewChild('messagesContainer')
  public messagesContainer: ElementRef;

  public myChats: Observable<Queue> = this.chatter.syncMyChats();
  public freeChats: Observable<Queue> = this.chatter.syncFreeChats();

  public chat: Chat = null;
  public selectedChat: BehaviorSubject<Chat> = new BehaviorSubject(null);
  public subscription: Subscription = null;

  constructor(
    private chatter: ChatService
  ) {

  }

  public ngOnInit(): void {
    this.subscription = this.selectedChat.asObservable()
      .switchMap(selectedChat => this.chatter.syncChat(selectedChat && selectedChat.id))
      .subscribe(chat => {
        this.chat = chat;
        if (this.chat) {
          this.onScrollDown();
        }
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
      this.onScrollDown();
    }
  }

  /**
   * Отпустить клиента
   */
  public onRelease(): void {
    this.chat = null; // TODO: Отпустить клиента
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
