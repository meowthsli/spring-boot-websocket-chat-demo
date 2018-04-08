import { Moment } from 'moment';
import { User } from './user.model';

export interface IMessage {
  id?: number;
  tempId?: number;
  author: User;
  text: string;
  datetime: Moment;
  fromClient: boolean;
  attachmentId: string;
}

export class Message {

  public id: number; // Идентификатор Сообщения
  public tempId: number; // Временный Идентификатор Сообщения
  public author: User = null; // Автор Сообщения
  public text: string = ''; // Текст Сообщения
  public datetime: Moment = null; // Время Сообщения
  public fromClient: boolean = false;
  public attachmentId: string = null;

  constructor(data: IMessage) {
    this.id = data.id;
    this.tempId = data.tempId;
    this.author = data.author;
    this.text = data.text;
    this.datetime = data.datetime;
    this.fromClient = data.fromClient;
    this.attachmentId = data.attachmentId;
  }

}
