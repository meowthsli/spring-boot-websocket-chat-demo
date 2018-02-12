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

}
