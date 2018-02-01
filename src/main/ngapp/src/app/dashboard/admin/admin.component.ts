import { Component, OnInit } from '@angular/core';
import { NbMenuItem, NbSidebarService } from '@nebular/theme';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public readonly menuItems: NbMenuItem[] = [
    {
      title: 'Все компании',
      link: '/dashboard/admin/organizations',
      icon: 'nb-list'
    }
  ];

  constructor(
    private sidebarService: NbSidebarService
  ) { }

  public ngOnInit() {
  }

  public toggleSidebar(): void {
    this.sidebarService.toggle(true, 'menu-sidebar');
  }

}
