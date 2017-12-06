import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { StompConnector } from '../stomp/app.stomp';

import { NbTabsetComponent } from '@nebular/theme/components/tabset/tabset.component';


/**
 * @title Main app component
 */
@Component({
  selector: 'app-chat',
  templateUrl: './app.chat.html',
  styleUrls: ['./app.chat.css']
})
export class ChatComponent implements OnInit {

  @ViewChild(NbTabsetComponent) public $tabs : NbTabsetComponent;
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
      setTimeout(() => {
        this.$tabs.selectTab(this.$tabs.tabs.last);
      }, 0);
    } else {
      let ucidx = this.$discussions.findIndex(c => c == uc);
      this.$tabs.selectTab(this.$tabs.tabs.toArray()[ucidx]);
    }
  }

  /**
   * Close chat by click
   * @param item 
   */
  public $onCloseClick(item: UserChat) {
    var i = this.$discussions.findIndex(x => x == item);
    this.$discussions.splice(i, 1);
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
          this.scrollDown(uc);
        }
      }  
    });
    this.stomp.connect(this.uctx.username);
  }

  public $onSendClick(chat: UserChat) {
    if(chat.$text != '') {
      chat.addItem(this.cids--, chat.$text, btoa(this.uctx.username));
      this.stomp.send(chat.$text, chat.clientID); // TODO
      chat.$text = null;
      this.scrollDown(chat);
    }
  }

  private scrollDown(d: UserChat) {
    setTimeout(() =>  {
        let element = document.getElementById(d.clientID);
        element.scrollTop = element.scrollHeight ;
    }, 0);
}

  private cids : number = -1;
}

export class ChatItem {
  public constructor(public id, public username, public text, public opId, public at) {}
}

class UserChat {
  public $text: string;

  public addHistory(items: any): any {
    for(var ci of items) {
        this.$history.push(new ChatItem(ci.id, '*', ci.text, ci.opId, '12:35'));
    }
  }
  constructor(public clientID: string, public $history: Array<ChatItem>){}

  public addItem(id, text: string, opID: string) {
    this.$history.push(new ChatItem(id, this.clientID, text, opID, '12:27'));
  }

  public ack(ack: number, cid: number) {
    var item = this.$history.find(ci => ci.id == cid); // find by candidate id
    if(item) {
        item.id = ack;
    }
  }
}