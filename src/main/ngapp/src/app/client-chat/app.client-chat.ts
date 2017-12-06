import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { ClientStompConnector } from '../stomp/app.client-stomp';
import * as moment from 'moment';

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

    constructor(private router:Router, private uctx: UsercontextService, private stomp: ClientStompConnector) {}
    
    public $onSendClick() {
        let ci = new ChatItem(this.cids--, null, this.$text, moment());
        this.$history.push(ci);
        this.stomp.send(ci);
        this.$text = null;
        this.scrollDown();
    }

    cids : number = -1;

    ngOnInit(): void {
        if(!this.uctx.username) {
            this.router.navigateByUrl(''), {skipLocationChange: true};
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
                for(var ci of msg.chatItems) {
                    this.$history.push(new ChatItem(ci.id, ci.opId, ci.text, moment(ci.at*1000)));
                }
                this.scrollDown();
            }
        });

        this.stomp.connect(this.uctx.username);  
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