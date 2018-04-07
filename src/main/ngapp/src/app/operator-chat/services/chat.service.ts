import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Queue } from '../models/queue.model';
import { Chat } from '../models/chat.model';
import { Author } from '../models/author.model';
import { Message } from '../models/message.model';
import * as moment from 'moment';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { environment } from '../../../environments/environment';
import { Envelope } from '../../connectors-gen-1.0-SNAPSHOT/org/wolna/ouchat/Envelope';
import { NbAuthService } from '../../auth/services/auth.service';
import { OUChatOpConnectorImpl } from '../../connectors-gen-1.0-SNAPSHOT/org/wolna/ouchat/impl/ops-connector';
import { ToasterService } from 'angular2-toaster';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { combineLatest } from 'rxjs/observable/combineLatest';
import FileTextMessage = Envelope.FileTextMessage;
import TextMessage = Envelope.TextMessage;

export enum ConnectionStatus {
  DEFAULT = 0,
  CONNECTING = 1,
  CONNECTED = 2,
  ERROR = 3
}

@Injectable()
export class ChatService {

  public status = ConnectionStatus.DEFAULT;

  private freeChats: BehaviorSubject<Queue> = new BehaviorSubject(new Queue({chats: []}));
  private myChats: BehaviorSubject<Queue> = new BehaviorSubject(new Queue({chats: []}));
  private selectedChat: BehaviorSubject<Chat> = new BehaviorSubject(null);

  private operator: Author = new Author({
    id: '1',
    operatorId: '1',
    fullname: 'A A'
  }); // TODO: Operator

  constructor(
    private connector: OUChatOpConnectorImpl,
    private auth: NbAuthService,
    private toaster: ToasterService
  ) {
    this.initialize();
  }

  private initialize(): void {
    this.connector.onResult(msg => {

      if(msg.messageAccepted) { // acknowledge of message
        this.myChats.value.updateMessage(msg.messageAccepted.messageTemporaryId, msg.messageAccepted.messageId, moment(msg.messageAccepted.when))
      } else if(msg.messages) {

        if (msg.messages.messages.length + msg.messages.fileMessages.length === 1) {

          const m: TextMessage = msg.messages.messages.concat(msg.messages.fileMessages)[0];

          const message: Message = new Message({
            id: m.id,
            author: new Author({
              id: msg.messages.userLogin,
              fullname: msg.messages.userLogin
            }),
            text: m.text,
            datetime: moment(m.dateAt),
            fromClient: m.fromClient,
            attachmentId: (m as FileTextMessage).contentReference
          });

          if ( this.myChats.value.hasClient(message.author) ) {
            this.myChats.next(this.myChats.value.appendMessage(message));
          } else {
            this.freeChats.next(this.freeChats.value.appendMessage(message));
          }

        } else if (this.selectedChat.value && this.selectedChat.value.id === msg.messages.userLogin) {
          this.selectedChat.next(this.selectedChat.value.updateMessages(msg.messages.messages
            .concat(msg.messages.fileMessages)
            .map(message => {
              return new Message({
                id: message.id,
                author: message.fromClient ? this.selectedChat.value.author: this.operator,
                text: message.text,
                datetime: moment(message.dateAt),
                fromClient: message.fromClient,
                attachmentId: (message as FileTextMessage).contentReference
              });
            })
          ));
        }

        //this.$nowLoading = false;
        //if(!msg.chatItems) return;
        //let uc = this.findChat(msg.clientID);
        //if(uc) {
        //  let x = null, y = null;
        //  if(uc.$history && uc.$history.length>0) {
        //    y = document.getElementById(this.$currentClientID);
        //    x = document.getElementById("text_" + uc.$history[0].realId);
        //  }
        //  uc.merge(null, msg.chatItems);
        //  if(x && y) {
        //    setTimeout(() => {
        //      y.scrollTop = (x.offsetTop - 50);
        //    }, 0);
        //  }
        // }
      } else if (msg.tryLockChat) {
        // TODO: lock chat
        // this.onMessage_LOCK_OK(msg);
      } else if (msg.releaseChat) {
        // TODO: release chat
        // this.opID = msg.opID;
      } else if (msg.fileContent) {
        const data = msg.fileContent.content;
        const filename = msg.fileContent.filename;
        const element: HTMLElement = document.createElement('a');
        element.setAttribute('download', filename);
        element.setAttribute('href', data);
        element.setAttribute('target', '_blank');
        element.click();
        element.remove();
      }
    });

    this.connector.onConnected(ok => this.onConnected());
    this.connector.onError(error => this.onError(error));
  }

  private onError(error) {
    this.status = ConnectionStatus.ERROR;
    let toast = this.toaster.pop("warning", "Нет связи с сервером", "Кликните, чтобы соединиться");
    toast.clickHandler = (toast, button) => {
      this.toaster.clear();
      this.connect();
      return true;
    };
  }

  private onConnected() {
    this.status = ConnectionStatus.CONNECTED;
    this.toaster.clear();
  }

  public connect(): void {
    this.status = ConnectionStatus.CONNECTING;
    this.auth.getToken().toPromise().then(token => {
      this.connector.connect(
        environment.wsAddress + '',
        token.getValue(),
        new Envelope.UserDescription('bro@mail.ru', "fio fio", [])
      );
    });
  }

  /**
   * Send Message
   *
   * @param {string} clientId
   * @param {string} text
   */
  public sendMessage(clientId: string, text: string): void {
    const tempId: number = this.connector.say(clientId, text);
    this.myChats.value.appendMessage(new Message({
      id: tempId,
      author: this.operator,
      text: text,
      datetime: moment(),
      fromClient: false,
      attachmentId: null
    }), clientId);
  }

  /**
   * Send File
   *
   * @param {string} clientId
   * @param {string} text
   */
  public sendFile(clientId: string, data: string, filename: string): void {
    const tempId: number = this.connector.sendFile(data, filename);
    this.myChats.value.appendMessage(new Message({
      id: tempId,
      author: this.operator,
      text: filename,
      datetime: moment(),
      fromClient: false,
      attachmentId: null
    }), clientId);
  }

  /**
   * Синхронизация свободных чатов
   *
   * @returns {Observable<Queue>}
   */
  public syncFreeChats(): Observable<Queue> {
    return this.freeChats.asObservable();
  }

  /**
   * Синхронизация чатов Оператора
   *
   * @returns {Observable<Queue>}
   */
  public syncMyChats(): Observable<Queue> {
    return this.myChats.asObservable();
  }

  /**
   * Синхронизация чата
   *
   * @param {string} id Идентификатор чата
   * @returns {Observable<Chat>}
   */
  public syncSelectedChat(): Observable<Chat> {
    return this.selectedChat.asObservable();
  }

  /**
   * Select Chat
   *
   * @param {Chat} chat
   */
  public selectChat(chat: Chat): void {
    this.connector.tryAcquireChat(chat.id);

    if ( ! chat.operatorId) {
      this.myChats.next(this.myChats.value.prependChat(chat.assignOperator('1')));
      this.freeChats.next(this.freeChats.value.removeChat(chat));
    }

    this.selectedChat.next(chat);

    this.connector.loadHistory(chat.id, chat.messages[chat.messages.length - 1].id);
  }

  /**
   * Remove Chat
   *
   * @param {Chat} chat
   */
  public removeChat(chat: Chat): void {
    this.connector.releaseChat(chat.id);
    this.myChats.next(this.myChats.value.removeChat(chat));
  }

  /**
   * Download Attachment
   *
   * @param {string} data
   */
  public downloadAttachment(message: Message): void {
    this.connector.requestFile(message.attachmentId);
  }

}
