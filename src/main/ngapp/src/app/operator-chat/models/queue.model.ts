import { Chat } from './chat.model';
import { Message } from './message.model';
import { Author } from './author.model';
import { Moment } from 'moment';

export interface IQueue {
  chats: Chat[];
}

export class Queue {

  public chats: Chat[] = [];

  constructor(data: IQueue) {
    this.chats = data.chats;
  }

  /**
   * Chat filter
   *
   * @param {string} query
   * @returns {Queue}
   */
  public filterChats(query: string): Queue {
    const term: string = (query || '').trim().toLowerCase();
    return new Queue({
      chats: this.chats.filter(chat => chat.author.fullname.toLowerCase().search(term) > -1)
    });
  }

  /**
   * Прикрепить чат
   *
   * @param {Chat} chat
   * @returns {Queue}
   */
  public prependChat(chat: Chat): Queue {
    this.chats.unshift(chat);
    return this;
  }

  /**
   * Исключить чат
   *
   * @param {Chat} chat
   * @returns {Queue}
   */
  public removeChat(chat: Chat): Queue {
    this.chats = this.chats.filter(c => c.id !== chat.id);
    return this;
  }

  /**
   * Update Chat
   *
   * @param {Chat} chat
   * @returns {Queue}
   */
  public updateChat(chat: Chat): Queue {
    this.chats[this.chats.indexOf(this.chats.find(c => c.id === chat.id))] = chat;
    return this;
  }

  /**
   * Append Message
   *
   * @param {Message} message
   * @param {string} clientId
   * @returns {Queue}
   */
  public appendMessage(message: Message, clientId: string = null): Queue {
    // TODO: append message
    const chat: Chat = clientId ?
      this.chats.find(chat => chat.author.id === clientId)
      :
      this.chats.find(chat => chat.author.id === message.author.id);
    if (chat) {
      this.updateChat(chat.addMessage(message));
    } else {
      this.prependChat(new Chat({
        operatorId: null,
        id: message.author.id,
        messages: [message],
        author: message.author
      }));
    }
    return this;
  }

  /**
   * Has Client
   *
   * @param {Author} author
   * @returns {boolean}
   */
  public hasClient(author: Author): boolean {
    return this.chats.some(chat => chat.author.id === author.id);
  }

  /**
   * Update Message
   *
   * @param {number} tempMessageId
   * @param {number} messageId
   * @param {moment.Moment} datetime
   * @returns {Queue}
   */
  public updateMessage(tempMessageId: number, messageId: number, datetime: Moment): Queue {
    const chat: Chat = this.chats.find(chat => chat.messages.some(message => message.id === tempMessageId));
    chat.updateMessage(tempMessageId, messageId, datetime);
    return this;
  }

}
