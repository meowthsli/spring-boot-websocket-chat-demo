import { Component } from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsercontextService } from './app.usercontext';
import { StompConnector } from './app.stomp';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { ClientStompConnector } from './app.client-stomp';

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
        this.$history.push(new ChatItem(this.cids--, 'ME', this.$text, null));
        this.stomp.send(this.$text);
        this.$text = null;
    }

    cids : number = -1;

    ngOnInit(): void {
        this.stomp.connect(this.uctx.username);  
        this.stomp.incomingMessage.subscribe(msg => {
            if(msg.type === 'MSG_ACK') {
                var item = this.$history.find(ci => ci.id == msg.cid);
                if(item) {
                    item.id = msg.ack;
                }
            } else if(msg.type === 'MSG_CHAT') {
                this.$history.push(new ChatItem(msg.id, 'OPS', msg.text, null));
            } else if(msg.type === 'CLI_HISTORY') {
                for(var ci of msg.chatItems) {
                    this.$history.push(new ChatItem(ci.id, ci.opId?'OPS':'ME', ci.text, null));
                }
            }
        });
    }   
}

export class ChatItem {
    public constructor(public id, public username, public text, public date) {}
}