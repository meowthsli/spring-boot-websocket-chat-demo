import { Component, Inject, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { StompConnector } from '../stomp/app.stomp';


/**
 * @title Main app component
 */
@Component({
  selector: 'app-chat',
  templateUrl: './app.chat.html',
  styleUrls: ['./app.chat.css']
})
export class ChatComponent implements OnInit{

  $text: string;
  $history: Array<ChatItem> = new Array();

  constructor(private router:Router, private uctx: UsercontextService, private stomp: StompConnector) {
    this.clientId = btoa(this.uctx.username);
  }

  clientId: string;

  ngOnInit(): void {
    if(!this.uctx.username ){
      this.router.navigateByUrl(''), {skipLocationChange: true};
    }
    this.stomp.incomingMessage.subscribe(msg => {
      if(msg.type === 'MSG_ACK') { // acknowledge of message
        var item = this.$history.find(ci => ci.id == msg.cid); // find by candidate id
        if(item) {
            item.id = msg.ack;
        }
      } else if(msg.type === 'CHAT') {
        if(msg.author === this.clientId && msg.author != msg.to) { // TODO - replace to cli username
          this.$history.push(new ChatItem(msg.id, 'CLI', msg.text, null));
        }
      } else if(msg.type === 'CLI_HISTORY') {
          for(var ci of msg.chatItems) {
              this.$history.push(new ChatItem(ci.id, ci.opId?'OPS':'CLI', ci.text, null));
          }
      }  
    });
    this.stomp.connect(this.uctx.username);   
  }

  cids : number = -1;

  public $onSendClick() {
    this.$history.push(new ChatItem(this.cids--, 'OPS', this.$text, null));
    this.stomp.send(this.$text, this.clientId); // TODO
    this.$text = null;
  }
}

export class ChatItem {
  public constructor(public id, public username, public text, public date) {}
}