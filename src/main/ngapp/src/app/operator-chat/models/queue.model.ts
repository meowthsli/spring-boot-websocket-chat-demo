import { Chat } from './chat.model';

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

}
