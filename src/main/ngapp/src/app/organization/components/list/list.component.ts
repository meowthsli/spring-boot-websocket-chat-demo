import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { Organization, OrganizationService } from '../../organization.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  public settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      columnTitle: 'Действия',
      add: false,
      edit: false
    },
    columns: {
      name: {
        title: 'Имя',
        type: 'string'
      },
      email: {
        title: 'Email',
        type: 'string'
      }
    },
  };

  public source: LocalDataSource = new LocalDataSource();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private service: OrganizationService
  ) {
    this.service.getOrganizations().subscribe(organizations => this.source.load(organizations));
  }

  public ngOnInit() {
  }

  public onSelectOrganization(event: {data: Organization}): void {
    this.router.navigate(['../organization/', event.data.email], {relativeTo: this.activatedRoute});
  }

  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
