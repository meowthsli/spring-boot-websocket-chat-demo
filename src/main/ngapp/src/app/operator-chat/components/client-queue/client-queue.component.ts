import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { StompConnector } from '../../../stomp/app.stomp';

@Component({
  selector: 'app-client-queue',
  templateUrl: './client-queue.component.html',
  styleUrls: ['./client-queue.component.scss']
})
export class ClientQueueComponent implements OnInit {

  // bindings
  public $queue: Array<QueueItem> = new Array();
  @Output() public $clientOpen: EventEmitter<String> = new EventEmitter();

  // methods
  public constructor(private stomp: StompConnector) {}

  ngOnInit(): void {
    this.stomp.incomingMessage.subscribe(msg => this.onMessage(msg));
  }

  private onMessage(p:any) {
    if(p.type === "OP_UNREAD_LIST") {
      if(p.chatItems && p.chatItems.length > 0) {
        let qi = this.$queue.find(qi => qi.clientID == p.clientID);
        let text = p.chatItems[p.chatItems.length-1].text; // последнее сообщение
        let id = p.chatItems[p.chatItems.length-1].id
        if(!qi) {
          this.$queue.push(new QueueItem(null, p.clientID, text, id, p.ack));
        } else {
          qi.text = text;
        }

        this.stomp.getInfo([p.clientID]);
      }
    }

    if(p.type === "CHAT") {
      if(p.opID) {
        return;
      }
      var qi = this.$queue.find(qi => qi.clientID == p.clientID);
      if(qi) {
        qi.id = p.ack;
        qi.text = p.chatItems[0].text;
        qi.lost = p.ack;
      } else {
        this.$queue.push(new QueueItem(this.nameCache[p.clientID], p.clientID, p.chatItems[0].text, p.ack, p.ack));
      }

      if(!this.nameCache[p.clientID]) {
        this.stomp.getInfo([p.clientID]);
      }
    }

    if(p.type === 'LOCK_OK') {
      let i = this.$queue.findIndex(qi => qi.clientID == p.clientID);
      if(i >= 0) {
        this.$queue.splice(i, 1);
      }
    }

    if(p.type === 'INFO') {
      for(var i = 0; i < p.info.length; ++i) {
        let qi = this.$queue.find(x => x.clientID === p.info[i]);
        if(qi) {
          //console.log("replace qi.autor () by (): ", qi.author, p.infoDesc[i].realName);
          qi.author = p.infoDesc[i].realName;
          this.nameCache[qi.clientID] = qi.author;
        }
      }
    }
  }

  private nameCache = {

  };
}

// item to show
export class QueueItem {
  public constructor(public author: String, public clientID: string, public text: String, public id: number,
                     public lost: number){

  }
}

