import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { UsercontextService } from './app.usercontext';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';
import { StompConnector } from './app.stomp';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-chat',
  templateUrl: './app.chat.html',
  styleUrls: ['./app.chat.css']
})
export class ChatComponent implements OnInit{

  constructor(private router:Router, private uctx: UsercontextService, private stomp: StompConnector) {
    
  }

  ngOnInit(): void {
    //this.stomp.incomingMessage.subscribe((msg) => {console.log('Chat page: msg ', msg )});
    this.stomp.connect(this.uctx.username);   
  }
}