import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Organization, OrganizationService } from './organization.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-organization',
  templateUrl: './organization.component.html',
  styleUrls: ['./organization.component.scss']
})
export class OrganizationComponent implements OnInit {

  public operatorSettings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      columnTitle: 'Действия'
    },
    columns: {
      name: {
        title: 'Имя',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      }
    },
  };

  public tokenSettings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    actions: {
      columnTitle: 'Действия',
      delete: false
    },
    columns: {
      name: {
        title: 'Название',
        type: 'string',
      },
      token: {
        title: 'Ключ',
        type: 'string',
      },
      disabled: {
        title: 'Статус',
        filter: {
          type: 'checkbox',
          config: {
            true: 'Активен',
            false: 'Блокирован',
            resetText: 'Показать все',
          },
        },
        editor: {
          type: 'checkbox',
          config: {
            true: 'Активен',
            false: 'Блокирован'
          }
        }
      }
    },
  };

  public operatorSource: LocalDataSource = new LocalDataSource();

  public tokenSource: LocalDataSource = new LocalDataSource();

  public organization: Observable<Organization>;

  constructor(
    private route: ActivatedRoute,
    private service: OrganizationService
  ) {
    const organizationId: string = this.route.snapshot.paramMap.get('id');
    this.organization = this.service.getOrganization(organizationId);
    this.service.getOperators().subscribe(operators => this.operatorSource.load(operators));
    this.service.getTokens().subscribe(tokens => this.tokenSource.load(tokens));
  }

  public ngOnInit() {
  }

  public onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
