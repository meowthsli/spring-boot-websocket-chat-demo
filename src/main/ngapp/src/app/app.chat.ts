import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-chat',
  templateUrl: './app.chat.html',
  styleUrls: ['./app.chat.css']
})
export class ChatComponent {
  constructor(private router:Router) {
    
  }
}