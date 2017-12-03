import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { StompConnector } from '../stomp/app.stomp';
import { MatTabGroup } from '@angular/material';


/**
 * @title Main app component
 */
@Component({
  selector: 'app-chat',
  templateUrl: './app.chat.html',
  styleUrls: ['./app.chat.css']
})
export class ChatComponent implements OnInit{
  @ViewChild(MatTabGroup) $tabs: MatTabGroup;

  $text: string;
  $discussions: Array<UserChat> = new Array();

  /**
   * Click on client 
   */
  public $startClientChat(clientID: string) {
    
    let uc = this.findChat(clientID);
    if(!uc) { // try to find such chat; if found, switch to
      uc = new UserChat(clientID, new Array());
      this.$discussions.push(uc); // create chat
      this.stomp.loadHistory(clientID); // ask for history items
    }
    
    this.$tabs.selectedIndex = this.$discussions.findIndex(x => x == uc);
  }

  constructor(private router:Router, private uctx: UsercontextService, private stomp: StompConnector) {
    
  }

  private findChat(userid: string) : UserChat {
    return this.$discussions.find(uc => uc.clientID == userid);
  }

  ngOnInit(): void {
    if(!this.uctx.username ){
      this.router.navigateByUrl(''), {skipLocationChange: true};
    }
    this.stomp.incomingMessage.subscribe(msg => {
      if(msg.type === 'MSG_ACK') { // acknowledge of message
        let uc = this.findChat(msg.clientID);
        if(uc) {
          uc.ack(msg.cid, msg.ack);
        }
      } else if(msg.type === 'CHAT') {
        let uc = this.findChat(msg.clientID);
        if(uc && msg.opID != btoa(this.uctx.username)) {
          uc.addItem(msg.ack, msg.text, msg.opID);
        }
      } else if(msg.type === 'CLI_HISTORY') {
        if(!msg.chatItems) return;
        let uc = this.findChat(msg.clientID);
        if(uc) {
          uc.addHistory(msg.chatItems);
        }
      }  
    });
    this.stomp.connect(this.uctx.username);   
  }

  cids : number = -1;

  public $onSendClick(chat: UserChat) {
    if(this.$text != '') {
      // this.$history.push(new ChatItem(this.cids--, 'OPS', this.$text, null));
      chat.addItem(this.cids--, this.$text, btoa(this.uctx.username));
      this.stomp.send(this.$text, chat.clientID); // TODO
      this.$text = null;
    }
  }
}

export class ChatItem {
  public constructor(public id, public username, public text, public opID, public date) {}
}

class UserChat {
  public addHistory(items: any): any {
    for(var ci of items) {
        this.$history.push(new ChatItem(ci.id, '*', ci.text, ci.opId, null));
    }
  }
  constructor(public clientID: string, public $history: Array<ChatItem>){}

  public addItem(id, text: string, opID: string) {
    this.$history.push(new ChatItem(id, this.clientID, text, opID, null));
  }

  public ack(ack: number, cid: number) {
    var item = this.$history.find(ci => ci.id == cid); // find by candidate id
    if(item) {
        item.id = ack;
    }
  }
}