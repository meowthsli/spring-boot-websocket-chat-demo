import { Message } from './message.model';
import { Author } from './author.model';
import * as moment from 'moment';
import { Moment } from 'moment';

export interface IChat {
  operatorId: string;
  id: string;
  messages: Message[];
  author: Author;
}

export class Chat {

  public readonly id: string = null; // Идентификатор чата
  public operatorId: string = null; // Идентификатор Оператора
  public messages: Message[] = []; // Сообщения
  public readonly author: Author = null; // Клиент

  public newMessagesLength: number = 0; // Количество непрочитанных сообщений
  public lastMessage: Message = null; // Последнее сообщение

  constructor(data: IChat) {
    this.id = data.id;
    this.operatorId = data.operatorId;
    this.messages = data.messages;
    this.author = data.author;
    this.initialize();
  }

  private initialize(): void {
    this.messages = this.messages.sort((mA, mB) => mA.datetime.valueOf() - mB.datetime.valueOf());
    this.newMessagesLength = this.messages.filter(message => message.fromClient).length;
    this.lastMessage = this.messages.slice().reverse().find(message => message.fromClient);
  }

  /**
   * Добавить сообщение от имени Оператора
   *
   * @param {string} text
   * @returns {Chat}
   */
  public appendMessage(text: string): Chat {
    this.messages.push(new Message({
      text: text,
      author: new Author({
        id: '1',
        operatorId: '2',
        fullname: 'Оператор'
      }),
      datetime: moment(),
      fromClient: false
    }));
    return this;
  }

  /**
   * Прикрепить оператора к чату
   *
   * @param {string} operatorId
   * @returns {Chat}
   */
  public assignOperator(operatorId: string): Chat {
    this.operatorId = operatorId;
    return this;
  }

  /**
   * Add Message
   *
   * @param {Message} message
   * @returns {Chat}
   */
  public addMessage(message: Message): Chat {
    this.messages = this.messages.concat([message]);
    this.initialize();
    return this;
  }

  /**
   * Update Message
   *
   * @param {number} tempMessageId
   * @param {number} messageId
   * @param {moment.Moment} datetime
   * @returns {Chat}
   */
  public updateMessage(tempMessageId: number, messageId: number, datetime: Moment): Chat {
    const message: Message = this.messages.find(message => message.id === tempMessageId);
    if (message) {
      this.messages[this.messages.indexOf(message)] = new Message({
        id: messageId,
        tempId: tempMessageId,
        author: message.author,
        text: message.text,
        datetime: datetime,
        fromClient: message.fromClient
      });
      this.initialize();
    }
    return this;
  }

}
