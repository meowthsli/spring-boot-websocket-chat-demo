import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { ClientStompConnector } from '../stomp/app.client-stomp';
import * as moment from 'moment';
import { NbSpinnerService } from '@nebular/theme';
import { ToasterService } from 'angular2-toaster/src/toaster.service';
import { ToasterConfig } from 'angular2-toaster';
import { ClientDesc, FIO } from '../stomp/app.stomp';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-clientchat',
  templateUrl: './app.client-chat.html',
  styleUrls: ['./app.client-chat.css']
})
export class ClientChatComponent implements OnInit {

    $text: string;
    $history: Array<ChatItem> = new Array();
    $connecting: number = 0;

    $toasterconfig = new ToasterConfig({
        showCloseButton: false, 
        tapToDismiss: true, 
        timeout: 0,
        limit: 1,
    });

    constructor(private router:Router, private uctx: UsercontextService, private stomp: ClientStompConnector, 
        private spinner: NbSpinnerService, private toaster: ToasterService) {}
    
    public $onSendClick() {
        let ci = new ChatItem(this.cids--, null, this.$text, moment());
        this.$history.push(ci);
        this.stomp.send(ci);
        this.$text = null;
        this.scrollDown();
    }

    cids : number = -1;
    private clientID: string;

    ngOnInit(): void {
        if(!this.uctx.username) {
            this.router.navigateByUrl(''), {skipLocationChange: false};
            return;
        }

        this.stomp.incomingMessage.subscribe(msg => {
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

        this.stomp.onConnected.subscribe(()=> {
            this.spinner.clear();
            this.$connecting = 2;
        });

        this.stomp.onError.subscribe(()=> this.onDisconnect());
        
        this.beginConnect();
    }

    private beginConnect() {
        this.$connecting = 1;
        this.spinner.load();
        this.stomp.connect(new ClientDesc(
            this.uctx.username + '@acme.org', 
            new FIO(this.uctx.username, '', ' Jackson'), 
            ['VIP', 'MOSCOW'],
            '+7 909 0000')
        );  
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
        // show warning
    }

    private scrollDown() {
        setTimeout(() =>  {
            let element = document.getElementById('chat-lines');
            element.scrollTop = element.scrollHeight ;
        }, 0);
    }
}

export class ChatItem {
    public constructor(public id, public opId, public text, public at: moment.Moment) {}
}