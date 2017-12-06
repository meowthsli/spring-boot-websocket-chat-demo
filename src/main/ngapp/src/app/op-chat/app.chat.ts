import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { StompConnector } from '../stomp/app.stomp';

import { NbTabsetComponent } from '@nebular/theme/components/tabset/tabset.component';
import {BtoaPipe, AtobPipe} from '../b64.pipe';
import {CapitalizePipe} from '../pipes/capitalize';
import { TimeformatPipe } from '../pipes/time-formatter';

import * as moment from 'moment';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-chat',
  templateUrl: './app.chat.html',
  styleUrls: ['./app.chat.css'],
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
        if(uc) {
          uc.addHistory(btoa(this.uctx.username), msg.chatItems);
          this.scrollDown(uc);
        }
      } else if(msg.type === 'CLI_HISTORY') {
        if(!msg.chatItems) return;
        let uc = this.findChat(msg.clientID);
        if(uc) {
          uc.addHistory(null, msg.chatItems);
          this.scrollDown(uc);
        }
      }  
    });
    this.stomp.connect(this.uctx.username);
  }

  public $onSendClick(chat: UserChat) {
    if(chat.$text != '') {
      let ci = chat.addItem(this.cids--, chat.$text, btoa(this.uctx.username), moment());
      this.stomp.send(chat.clientID, ci); 
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
  public constructor(public id, public username, public text, public opId, public at: moment.Moment) {}
}

class UserChat {
  public $text: string;

  public addHistory(opId: string, jsonItems: any): any {
    for(var ci of jsonItems) {
      if(!opId || opId != ci.opId ) { // skip our
        this.$history.push(new ChatItem(ci.id, null, ci.text, ci.opId, moment(ci.at*1000)));
      }
    }
  }
  constructor(public clientID: string, public $history: Array<ChatItem>){}

  public addItem(id, text: string, opID: string, at: moment.Moment) {
    let ci = new ChatItem(id, this.clientID, text, opID, at)
    this.$history.push(ci);
    return ci;
  }

  public ack(ack: number, cid: number) {
    var item = this.$history.find(ci => ci.id == cid); // find by candidate id
    if(item) {
        item.id = ack;
    }
  }
}