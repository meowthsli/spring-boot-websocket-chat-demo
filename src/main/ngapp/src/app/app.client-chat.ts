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

    constructor(private router:Router, private uctx: UsercontextService, private stomp: ClientStompConnector) {}

    public $onSendClick() {
        this.stomp.send(this.$text);
        this.$text = null;
    }

    ngOnInit(): void {
        this.stomp.connect(this.uctx.username);  
        this.stomp.incomingMessage.subscribe(msg => {});
    }   
}