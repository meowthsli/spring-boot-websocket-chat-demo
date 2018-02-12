import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsercontextService } from '../app.usercontext';
import { ClientStompConnector } from '../stomp/app.client-stomp';
import * as moment from 'moment';
import { NbSpinnerService } from '@nebular/theme';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { ToasterConfig } from 'angular2-toaster';
import { ClientDesc, FIO } from '../stomp/app.stomp';
import { OUChatClientConnector } from '../ou-chat-sdk/client-connector';
import { environment } from '../../environments/environment';
import { UserDesc, FIO as FIO2 } from '../ou-chat-sdk/dtos';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  public readonly fromNow: string = moment().fromNow();

  $text: string;
  $history: Array<ChatItem> = new Array();
  $connecting: number = 0;

  // messages
  $toasterconfig = new ToasterConfig({
    showCloseButton: false,
    tapToDismiss: true,
    timeout: 0,
    limit: 1,
  });

  constructor(private router:Router, private uctx: UsercontextService, /*private stomp: ClientStompConnector, */
              private connector: OUChatClientConnector,
              private spinner: NbSpinnerService, private toaster: ToasterService) {}

  // send message
  public $onSendClick() {
    if(this.$text) {
      let ci = new ChatItem(this.cids--, null, this.$text, moment());
      this.$history.push(ci);
      this.connector.say(ci.id, ci.text, null /*not used*/);
      this.$text = null;
      this.scrollDown();
    }
  }

  private cids : number = -1;
  private clientID: string;

  ngOnInit(): void {
    if(!this.uctx.username) {
      this.router.navigateByUrl(''), {skipLocationChange: false};
      return;
    }

    /*this.stomp.incomingMessage.subscribe(msg => {
		if(msg.type === 'MSG_ACK') {
			var item = this.$history.find(ci => ci.id == msg.cid);
			if(item) {
				item.id = msg.ack;
			}
		} else if(msg.type === 'CHAT') {
			for(var ci of msg.chatItems) {
				this.$history.push(new ChatItem(ci.id, ci.opId, ci.text, moment(ci.at*1000)));
			}
			this.scrollDown();
		} else if(msg.type === 'CLI_HISTORY') {
			this.clientID = msg.clientID;
			for(var ci of msg.chatItems) {
				this.$history.push(new ChatItem(ci.id, ci.opId, ci.text, moment(ci.at*1000)));
			}
			this.scrollDown();
		}
	});
	*/
    this.connector.onMessage.subscribe(msg => {
      if(msg.sayResp) {
        var item = this.$history.find(ci => ci.id == msg.sayResp.cid);
        if(item) {
          item.id == msg.sayResp.cid;
        }
      } else if(msg.historyResp) {
        this.clientID = msg.historyResp.clientID;
        for(var ci of msg.historyResp.chatItems) {
          this.$history.push(new ChatItem(ci.id, ci.opID, ci.text, moment(ci.at*1000)));
        }
        this.scrollDown();
      }
    });

    /*this.stomp.onConnected.subscribe(()=> {
		this.spinner.clear();
		this.$connecting = 2;
	});*/

    this.connector.onConnected.subscribe(()=> {
      this.spinner.clear();
      this.$connecting = 2;
    });

    /*
	this.stomp.onError.subscribe(()=> this.onDisconnect());
	*/
    this.connector.onError.subscribe(()=> this.onDisconnect());


    this.beginConnect();
  }

  private beginConnect() {
    this.$connecting = 1;
    this.spinner.load();

    /*this.stomp.connect(new ClientDesc(
		this.uctx.username + '@acme.org',
		new FIO(
			this.fn[Math.round(Math.random()*this.fn.length-1)],
			'', this.ln[Math.round(Math.random()*this.ln.length-1)]
		),
		['VIP', 'MOSCOW'],
		'+7 909 0000')
	);
	*/

    let email = `${this.uctx.username}-cli@acme.org`;
    let fio = new FIO2(this.fn[Math.round(Math.random()*this.fn.length-1)], '',
      this.ln[Math.round(Math.random()*this.ln.length-1)]);

    this.connector.connect(email, '***', environment.wsAddress, new UserDesc(email, fio, [], '+78988899999', 'Other info'));
  }

  private onDisconnect() {
    this.spinner.clear();
    this.$connecting = 0;

    let toast = this.toaster.pop("warning", "Нет связи с сервером", "Кликните, чтобы соединиться");
    toast.showCloseButton = true;
    toast.clickHandler = (toast, button) => {
      this.toaster.clear();
      this.beginConnect()
      return true;
    }
  }

  private scrollDown() {
    setTimeout(() =>  {
      let element = document.getElementById('chat-lines');
      element.scrollTop = element.scrollHeight ;
    }, 0);
  }

  private fn = ['Михаил', 'Петр', 'Максим', 'Андрей', 'Федор'];
  private ln = ['Иванов', 'Петров', 'Крамер', 'Сидоров', 'Фёдоров', 'Маслов'];
}

export class ChatItem {
  public constructor(public id, public opId, public text, public at: moment.Moment) {}
}