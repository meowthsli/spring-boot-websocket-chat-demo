import { Chat } from './chat.model';

export interface IQueue {
  chats: Chat[];
}

export class Queue {

  public chats: Chat[] = [];

  constructor(data: IQueue) {
    this.chats = data.chats;
  }

}
