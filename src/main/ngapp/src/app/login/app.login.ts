import { Component } from '@angular/core';
import { NgModel, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsercontextService } from '../app.usercontext';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-login',
  templateUrl: './app.login.html',
  styleUrls: ['./app.login.css']
})
export class LoginComponent {

  $username: string;
  $emailFormControl = new FormControl('', [
    Validators.required
  ]);
  
  constructor(private router:Router, private uctx: UsercontextService) {}  

  public $onLogonClick() {
    if(!this.$username) {
      return;
    }

    this.uctx.username = this.$username;
    this.router.navigateByUrl('/ops-chat'), {skipLocationChange: true};
  }

  public $onClientClick() {
    if(!this.$username) {
      return;
    }

    this.uctx.username = this.$username;
    this.router.navigateByUrl('/clients-chat'), {skipLocationChange: true};
  }
}