import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UsercontextService } from '../../app.usercontext';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public readonly form: FormGroup = new FormGroup({
    key: new FormControl('36284db9-3d2d-4d00-913d-cad1690a4edc'),
    email: new FormControl('ivan@mail.ru'),
    name: new FormControl('Иван Петров'),
    tags: new FormControl('Москва')
  });

  constructor(
    private user: UsercontextService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  public onSubmit(): void {
    this.user.name = this.form.get('name').value;
    this.user.username = this.form.get('email').value;
    this.user.apiKey = this.form.get('key').value;
    this.user.tags = this.form.get('tags').value.split(',').map(value => value.trim());
    this.router.navigateByUrl('/chat/client');
  }

}
