import { Author } from './author.model';
import { Moment } from 'moment';

export interface IMessage {
  author: Author;
  text: string;
  datetime: Moment;
}

export class Message {

  public author: Author = null; // Автор Сообщения
  public text: string = ''; // Текст Сообщения
  public datetime: Moment = null; // Время Сообщения

  constructor(data: IMessage) {
    this.author = data.author;
    this.text = data.text;
    this.datetime = data.datetime;
  }

}
