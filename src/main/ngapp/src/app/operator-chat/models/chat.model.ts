import { Message } from './message.model';
import { Author } from './author.model';
import * as moment from 'moment';

export interface IChat {
  operatorId: string;
  id: string;
  messages: Message[];
  author: Author;
}

export class Chat {

  public readonly id: string = ''; // Идентификатор чата
  public operatorId: string = null; // Идентификатор Оператора
  public messages: Message[] = []; // Сообщения
  public readonly author: Author = null; // Клиент

  public readonly newMessagesLength: number = 0; // Количество непрочитанных сообщений
  public readonly lastMessage: Message = null; // Последнее сообщение

  constructor(data: IChat) {
    this.id = data.id;
    this.operatorId = data.operatorId;
    this.messages = data.messages;
    this.author = data.author;

    this.newMessagesLength = data.messages.filter(message => message).length;
    this.lastMessage = data.messages[this.messages.length - 1];
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

  public addMessage(message: Message): Chat {
    return new Chat({
      operatorId: this.operatorId,
      id: this.id,
      messages: this.messages.concat([message]),
      author: this.author
    });
  }

}
