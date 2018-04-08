import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit() {

  }

}
