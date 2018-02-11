import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Queue } from '../models/queue.model';
import { Chat } from '../models/chat.model';
import { Author } from '../models/author.model';
import { Message } from '../models/message.model';
import * as moment from 'moment';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Injectable()
export class ChatService {

  constructor() { }

  /**
   * Синхронизация свободных чатов
   *
   * @returns {Observable<Queue>}
   */
  public syncFreeChats(): Observable<Queue> {
    return Observable.of(new Queue({
      chats: [
        new Chat({
          id: '1',
          messages: [
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: null,
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            })
          ],
          author: new Author({
            id: '1',
            operatorId: '1',
            fullname: 'Петров Сергей'
          })
        }),
        new Chat({
          id: '2',
          messages: [
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: null,
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            })
          ],
          author: new Author({
            id: '1',
            operatorId: '1',
            fullname: 'Николаев Степан'
          })
        })
      ]
    }));
  }

  /**
   * Синхронизация чатов Оператора
   *
   * @returns {Observable<Queue>}
   */
  public syncMyChats(): Observable<Queue> {
    return Observable.of(new Queue({
      chats: [
        new Chat({
          id: '3',
          messages: [
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: null,
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            })
          ],
          author: new Author({
            id: '1',
            operatorId: '1',
            fullname: 'Иванов Иван'
          })
        }),
        new Chat({
          id: '4',
          messages: [
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: null,
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            }),
            new Message({
              author: new Author({
                id: '1',
                operatorId: '1',
                fullname: 'Иванов Иван'
              }),
              text: 'Text text text',
              datetime: moment()
            })
          ],
          author: new Author({
            id: '1',
            operatorId: '1',
            fullname: 'Пушкин Александр'
          })
        })
      ]
    }));
  }

  /**
   * Синхронизация чата
   *
   * @param {string} id Идентификатор чата
   * @returns {Observable<Chat>}
   */
  public syncChat(id: string): Observable<Chat> {
    return forkJoin([
        this.syncFreeChats(),
        this.syncMyChats(),
      ])
      .map(results => {
        return results.map(queue => queue.chats).reduce((a, b) => a.concat(b), []).find(chat => chat.id === id);
      });
  }

}
