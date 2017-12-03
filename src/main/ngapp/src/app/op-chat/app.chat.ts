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
  
  $tab1Text = "Tab One";
  $tab2Text = "Tab Two";

  $discussions: Array<UserChat> = new Array();

  public $onClientClick(userId: string) {
    
    let uc = this.findChat(userId);
    if(uc) { // try to find such chat; if found, switch to
      this.$tabs.selectedIndex = this.$discussions.findIndex(x => x == uc);
      return;
    } 

    this.$discussions.push(new UserChat(userId, new Array())); // create chat
    this.stomp.loadHistory(userId); // ask for history items
  }

  constructor(private router:Router, private uctx: UsercontextService, private stomp: StompConnector) {
    // this.clientId = btoa(this.uctx.username);
  }

  // clientId: string;

  private findChat(userid: string) : UserChat {
    return this.$discussions.find(uc => uc.userid == userid);
  }

  ngOnInit(): void {
    if(!this.uctx.username ){
      this.router.navigateByUrl(''), {skipLocationChange: true};
    }
    this.stomp.incomingMessage.subscribe(msg => {
      if(msg.type === 'MSG_ACK') { // acknowledge of message
        let uc = this.findChat(msg.author);
        if(uc) {
          uc.ack(msg.cid, msg.ack);
        }
      } else if(msg.type === 'CHAT') {
        let uc = this.findChat(msg.author);
        if(uc && msg.author != msg.to) {
          uc.addItem(msg.id, msg.text);
              // if(msg.author === this.clientId && msg.author != msg.to) { // TODO - replace to cli username
              //  this.$history.push(new ChatItem(msg.id, 'CLI', msg.text, null));
              // }
        }
      } else if(msg.type === 'CLI_HISTORY') {
        if(!msg.chatItems) return;
        let uc = this.findChat(msg.to);
        if(uc) {
          uc.addHistory(msg.chatItems);
        }
              //for(var ci of msg.chatItems) {
              //    this.$history.push(new ChatItem(ci.id, ci.opId?'OPS':'CLI', ci.text, null));
              //}
      }  
    });
    this.stomp.connect(this.uctx.username);   
  }

  cids : number = -1;

  public $onSendClick(chat: UserChat) {
    if(this.$text != '') {
      // this.$history.push(new ChatItem(this.cids--, 'OPS', this.$text, null));
      chat.addItem(this.cids--, this.$text);
      this.stomp.send(this.$text, chat.userid); // TODO
      this.$text = null;
    }
  }
}

export class ChatItem {
  public constructor(public id, public username, public text, public date) {}
}

class UserChat {
  public addHistory(items: any): any {
    for(var ci of items) {
        this.$history.push(new ChatItem(ci.id, ci.opId?'OPS':'CLI', ci.text, null));
    }
  }
  constructor(public userid: string, public $history: Array<ChatItem>){}

  public addItem(id, text: string) {
    this.$history.push(new ChatItem(id, this.userid, text, null));
  }

  public ack(ack: number, cid: number) {
    var item = this.$history.find(ci => ci.id == cid); // find by candidate id
    if(item) {
        item.id = ack;
    }
  }
}