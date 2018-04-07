import { Component, OnInit } from '@angular/core';
import { NbAuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-supervisor',
  templateUrl: './supervisor.component.html',
  styleUrls: ['./supervisor.component.scss']
})
export class SupervisorComponent implements OnInit {

  public readonly userMenu = [
    {
      title: 'Выйти',
      link: '/auth/logout'
    }
  ];

  constructor(
    private auth: NbAuthService
  ) { }

  ngOnInit() {
    debugger;
    this.auth;
  }

}
