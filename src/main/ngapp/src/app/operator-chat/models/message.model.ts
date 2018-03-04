import { Author } from './author.model';
import { Moment } from 'moment';

export interface IMessage {
  id?: number;
  tempId?: number;
  author: Author;
  text: string;
  datetime: Moment;
  fromClient: boolean;
}

export class Message {

  public id: number; // Идентификатор Сообщения
  public tempId: number; // Временный Идентификатор Сообщения
  public author: Author = null; // Автор Сообщения
  public text: string = ''; // Текст Сообщения
  public datetime: Moment = null; // Время Сообщения
  public fromClient: boolean = false;

  constructor(data: IMessage) {
    this.id = data.id;
    this.tempId = data.tempId;
    this.author = data.author;
    this.text = data.text;
    this.datetime = data.datetime;
    this.fromClient = data.fromClient;
  }

}
