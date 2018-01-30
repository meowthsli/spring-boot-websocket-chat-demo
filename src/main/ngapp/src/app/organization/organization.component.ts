import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { OrganizationService } from './organization.service';

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
      username: {
        title: 'Имя',
        type: 'string',
      },
      email: {
        title: 'Email',
        type: 'string',
      },
      token: {
        title: 'Ключ',
        type: 'string',
        editor: {
          type: 'list',
          config: {
            list: [{value: '213123123123', title: '213123123123'}, {value: 'aaaaaaaaaaaaaaaa', title: 'aaaaaaaaaaaaa'}],
          },
        }
      },
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
      token: {
        title: 'Ключ',
        type: 'string',
      },
      disabled: {
        title: 'Блокирован',
        filter: {
          type: 'checkbox',
          config: {
            true: 'Блокирован',
            false: 'Активен',
            resetText: 'Показать все',
          },
        },
        editor: {
          type: 'checkbox',
          config: {
            true: 'Блокирован',
            false: 'Активен'
          }
        }
      }
    },
  };

  public operatorSource: LocalDataSource = new LocalDataSource();

  public tokenSource: LocalDataSource = new LocalDataSource();

  constructor(private service: OrganizationService) {
    this.service.getOperators().subscribe(operators => this.operatorSource.load(operators));
    this.service.getTokens().subscribe(tokens => {
      this.operatorSettings.columns.token.editor.config.list = tokens.map(token => ({
        title: token.token,
        value: token.token
      }));
      this.tokenSource.load(tokens);
    });
  }

  public ngOnInit() {
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

}
