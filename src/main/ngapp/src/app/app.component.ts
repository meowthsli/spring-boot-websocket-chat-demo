import { Component } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Router } from '@angular/router';

/**
 * @title Main app component
 */
@Component({
  selector: 'app-root',
  template: `
    <router-outlet></router-outlet>
  `
})
export class AppComponent {
  constructor() {
    
  }
}