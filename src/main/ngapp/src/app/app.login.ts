import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-login',
  templateUrl: './app.login.html',
  styleUrls: ['./app.login.css']
})
export class LoginComponent {
  public value: string;
  
  constructor(private router:Router) {
    
  }  

  public onClick() {
    console.log(this.router.navigateByUrl('/chat'));
  }
}