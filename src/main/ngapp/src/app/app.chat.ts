import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';
import { UsercontextService } from './app.usercontext';

import * as Stomp from 'stompjs';
import * as SockJS from 'sockjs-client';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-chat',
  templateUrl: './app.chat.html',
  styleUrls: ['./app.chat.css']
})
export class ChatComponent implements OnInit{

  private socket = new SockJS('/ws');
  private stompClient = Stomp.over(this.socket);

  constructor(private router:Router, private uctx: UsercontextService) {
    
  }

  ngOnInit(): void {
    this.stompClient.connect({}, () => this.onStompConnected(), () => this.onStompError());
  }

  onStompConnected() {
    console.log("Stomp connected");

    this.stompClient.subscribe('/channel/public', (payload) => this.onStompReceived(payload));
        this.stompClient.send("/app/chat.addUser",
            {}, JSON.stringify({sender: this.uctx.username, type: 'JOIN'})
        );
  }

  onStompError() {
    console.log("Stomp error");
  }

  onStompReceived(payload) {
    var message = JSON.parse(payload.body);
    console.log('payload = ', payload.body );
  }
}