import { Author } from './author.model';
import { Moment } from 'moment';

export interface IMessage {
  id?: string;
  tempId?: string;
  author: Author;
  text: string;
  datetime: Moment;
}

export class Message {

  public id: string; // Идентификатор Сообщения
  public tempId: string; // Временный Идентификатор Сообщения
  public author: Author = null; // Автор Сообщения
  public text: string = ''; // Текст Сообщения
  public datetime: Moment = null; // Время Сообщения

  constructor(data: IMessage) {
    this.id = data.id;
    this.tempId = data.tempId;
    this.author = data.author;
    this.text = data.text;
    this.datetime = data.datetime;
  }

}
