import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { UsercontextService } from '../app.usercontext';
import { ClientStompConnector } from '../stomp/app.client-stomp';

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
        this.$history.push(new ChatItem(this.cids--, null, this.$text, '11:22'));
        this.stomp.send(this.$text, this.cids);
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
                this.$history.push(new ChatItem(msg.id, msg.opID, msg.text, undefined));
                this.scrollDown();
            } else if(msg.type === 'CLI_HISTORY') {
                for(var ci of msg.chatItems) {
                    this.$history.push(new ChatItem(ci.id, ci.opId, ci.text, undefined));
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
    public constructor(public id, public opId, public text, public at) {}
}