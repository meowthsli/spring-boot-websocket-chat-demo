import { Component, ViewChild, ElementRef, Renderer2, AfterViewChecked } from '@angular/core';
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
export class ClientChatComponent implements OnInit, AfterViewChecked {

    $text: string;
    $history: Array<ChatItem> = new Array();

    @ViewChild('scroller') private $chatHistory: any;
    

    constructor(private router:Router, private uctx: UsercontextService, private stomp: ClientStompConnector,
        private rendere: Renderer2 ) {}
    
    public $onSendClick() {
        this.$history.push(new ChatItem(this.cids--, 'ME', this.$text, null));
        this.stomp.send(this.$text);
        this.$text = null;
        this.scrollDown();
    }

    cids : number = -1;
    toUpdate: boolean;

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
                this.$history.push(new ChatItem(msg.id, 'OPS', msg.text, null));
                this.scrollDown();
            } else if(msg.type === 'CLI_HISTORY') {
                for(var ci of msg.chatItems) {
                    this.$history.push(new ChatItem(ci.id, ci.opId?'OPS':'ME', ci.text, null));
                }
                this.scrollDown();
            }
        });

        this.stomp.connect(this.uctx.username);  
    }   


    private scrollDown() {
        this.toUpdate = true;
        //this.$chatHistory.scrollTop = this.$chatHistory.scrollHeight;
        //setTimeout(() =>  {
        //let element = document.getElementById('client-chat-panel');
        //element.scrollTop = this.$history.length * 100;
        //}, 1000);
    }

    ngAfterViewChecked(): void {
        if(this.toUpdate) {
            this.toUpdate = false;
            let element = document.getElementById('client-chat-panel');
            element.scrollTop = this.$history.length * 100;
        }
    }
}

export class ChatItem {
    public constructor(public id, public username, public text, public date) {}
}