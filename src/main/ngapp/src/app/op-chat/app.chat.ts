import { Component, Inject, Input, ViewChild } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { StompConnector, ClientDesc, FIO } from '../stomp/app.stomp';

import { NbTabsetComponent } from '@nebular/theme/components/tabset/tabset.component';
import {BtoaPipe, AtobPipe} from '../b64.pipe';
import {CapitalizePipe} from '../pipes/capitalize';
import { TimeformatPipe } from '../pipes/time-formatter';

import * as moment from 'moment';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { ToasterConfig } from 'angular2-toaster';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProfileComponent } from './app.profile';
import { SettingsComponent } from './app.management';

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

  $connecting: number = 0;
  $toasterconfig = new ToasterConfig({
    showCloseButton: false, 
    tapToDismiss: true, 
    timeout: 0,
    limit: 1,
  });

  $clientDescCache = {};
  $currentClientID: string = null;

  /**
   * Click on client 
   */
  public $startClientChat(clientID: string) {
    this.stomp.tryLock(clientID); // we maybe will have for LOCK_OK after that
  }

  public $profileClick() {
    const activeModal = this.modal.open(ProfileComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.$modalHeader = 'Профиль пользователя (демо режим)';
    activeModal.componentInstance.$email = this.uctx.username + '-op.acme.org';
  }

  public $settingsClick() {
    const activeModal = this.modal.open(SettingsComponent, { size: 'lg', container: 'nb-layout' });
    activeModal.componentInstance.$modalHeader = 'Панель управления (демо режим)';
    activeModal.componentInstance.$email = this.uctx.username + '-op.acme.org';
  }

  public $logout() {
    for(let d of this.$discussions) {
      this.stomp.release(d.clientID);
    }
    this.stomp.disconnect();
    this.router.navigateByUrl('', {skipLocationChange: false});
  }

  public $nowLoading: boolean = false;
  public $onScrollUp() {
    this.$nowLoading = true;
    // setTimeout(()=> {this.$nowLoading = false;}, 5000);
    this.stomp.loadHistory(this.$currentClientID);
    // show loader div, if no
    // load
    // hide after 10 seconds or after history load
  }

  constructor(private router:Router, private uctx: UsercontextService, private stomp: StompConnector,
    private toaster: ToasterService, private modal: NgbModal) {
      
  }

  private findChat(userid: string) : UserChat {
    return this.$discussions.find(uc => uc.clientID == userid);
  }

  ngOnInit(): void {
    if(!this.uctx.username ){
      this.router.navigateByUrl(''), {skipLocationChange: false};
      return;
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
          uc.addHistory(this.opID, msg.chatItems);
          this.scrollDown(uc);
        }
      } else if(msg.type === 'CLI_HISTORY') {
        this.$nowLoading = false;
        if(!msg.chatItems) return;
        let uc = this.findChat(msg.clientID);
        if(uc) {
          uc.addHistory(null, msg.chatItems);
          this.scrollDown(uc);
        }
      } else if (msg.type === 'LOCK_OK') {
        this.onMessage_LOCK_OK(msg);
      } else if (msg.type === 'OP_HELLO') {
        this.opID = msg.opID;
      }
    });

    this.stomp.onConnected.subscribe(()=> this.onConnect());
    this.stomp.onError.subscribe(()=> this.onError());

    setInterval(() => {
      if(this.subscribed || !this.$tabs) return;
      this.subscribed = true;
      this.$tabs.changeTab.subscribe(() => {
      if(this.$tabs) {
        let activeIndex = this.$tabs.tabs.toArray().findIndex(x => x.active);
        if(activeIndex >= 0) {
          this.$currentClientID = this.$discussions[activeIndex].clientID;
        }
      }
    })

    }, 1000);
    
    

    this.beginConnect();
  }

  subscribed = false;

  private onError() {
    this.$connecting = 0;
    let toast = this.toaster.pop("warning", "Нет связи с сервером", "Кликните, чтобы соединиться");
    toast.clickHandler = (toast, button) => {
        this.toaster.clear();
        this.beginConnect();
        return true;
    };
  }

  private onConnect() {
    this.$connecting = 2;
  }

  private beginConnect() {
    this.$connecting = 1;
    this.stomp.connect(new ClientDesc(this.uctx.username + '-op.acme.org',
      new FIO(this.uctx.username, '', 'Ops'),
      [],
      null ));
  }

  private onMessage_LOCK_OK(msg) {
    if(msg.opID != this.opID) { //   maybe it's not us
      return;
    }
    let clientID = msg.clientID;
    this.$clientDescCache[clientID] = msg.clientDesc;

    let uc = this.findChat(clientID);
    if(!uc) { // try to find such chat; if found, switch to
      uc = new UserChat(clientID, new Array(), this.$clientDescCache[clientID]);
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

  public $onSendClick(chat: UserChat) {
    if(chat.$text && chat.$text != '') {
      let ci = chat.addItem(this.cids--, chat.$text, this.opID, moment());
      this.stomp.send(chat.clientID, ci); 
      chat.$text = null;
      this.scrollDown(chat);
    }
  }

  public $release(chat: UserChat) {
    let activeIndex = this.$tabs.tabs.toArray().findIndex(x => x.active);
    if(chat) {
      this.stomp.release(chat.clientID);
      let i = this.$discussions.findIndex(c => c == chat);
      if(i >= 0) {
        this.$discussions.splice(i, 1);
      }
      if(this.$discussions.length > 0) {
        this.$tabs.selectTab(this.$tabs.tabs.toArray()[i-1]);
      }
    }

    // select previous tab
    if(this.$discussions.length > 0) {
      this.$currentClientID = this.$discussions[Math.max(activeIndex-1,0)].clientID;
    }
  }

  private scrollDown(d: UserChat) {
    setTimeout(() =>  {
        let element = document.getElementById(d.clientID);
        element.scrollTop = element.scrollHeight ;
    }, 0);
}

  private cids : number = -1;
  private opID: string;
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
  constructor(public clientID: string, public $history: Array<ChatItem>, public clientDesc: ClientDesc){}

  public addItem(id, text: string, opID: string, at: moment.Moment) {
    let ci = new ChatItem(id, this.clientID, text, opID, at)
    this.$history.push(ci);
    return ci;
  }

  public ack(cid: number, ack: number) {
    var item = this.$history.find(ci => ci.id == cid); // find by candidate id
    if(item) {
        item.id = ack;
    }
  }
}