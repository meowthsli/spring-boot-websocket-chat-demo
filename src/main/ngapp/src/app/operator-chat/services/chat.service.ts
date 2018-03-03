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
        //let uc = this.findChat(msg.clientID);
        //if(uc) {
        //  uc.ack(msg.cid, msg.ack);
        //}
      } else if(msg.clientMessage) {
        this.freeChats.next(this.freeChats.value.appendMessage(new Message({
          id: msg.clientMessage.message.id,
          author: new Author({
            id: msg.clientMessage.clientID,
            fullname: ''
          }),
          text: msg.clientMessage.message.text,
          datetime: moment(msg.clientMessage.message.dateAt),
          fromClient: msg.clientMessage.message.fromClient
        })));
        //let uc = this.findChat(msg.clientID);
        //if(uc) {
        //  uc.addHistory(this.opID, msg.chatItems);
        //  this.scrollDown(uc);
        // }
      } else if(msg.messages) {
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
        // this.onMessage_LOCK_OK(msg);
      } else if (msg.releaseChat) {
        // this.opID = msg.opID;
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
  public syncChat(id: string): Observable<Chat> {
    return forkJoin([
        this.syncFreeChats(),
        this.syncMyChats(),
      ])
      .map(results => {
        return results.map(queue => queue.chats).reduce((a, b) => a.concat(b), []).find(chat => chat.id === id);
      });
  }

}
