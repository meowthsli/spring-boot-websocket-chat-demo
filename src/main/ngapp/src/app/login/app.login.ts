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
  $apiKey: string = "22943c7b-997a-42a9-8d3e-0fdb75ab4d3b";

  $emailFormControl = new FormControl('', [
    Validators.required
  ]);

  constructor(private router:Router, private uctx: UsercontextService) {}

  public $onLogonClick() {
    if(!this.$username) {
      return;
    }

    this.uctx.username = this.$username;
    this.router.navigateByUrl('/ops-chat'), {skipLocationChange: false};
  }

  public $onClientClick() {
    if(!this.$username) {
      return;
    }

    this.uctx.username = this.$username;
    this.uctx.apiKey = this.$apiKey;
    this.router.navigateByUrl('/clients-chat'), {skipLocationChange: true};
  }

  public onStartAsOperator() {
    if ( ! this.$username) {
      return;
    }

    this.uctx.username = this.$username;
    this.router.navigateByUrl('/chat/operator'), {skipLocationChange: false};
  }

  public onStartAsClient() {
    if ( ! this.$username) {
      return;
    }

    this.uctx.username = this.$username;
    this.uctx.apiKey = this.$apiKey;
    this.router.navigateByUrl('/chat/client'), {skipLocationChange: false};
  }
}
