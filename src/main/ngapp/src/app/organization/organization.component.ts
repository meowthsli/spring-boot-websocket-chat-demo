import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { CompanyToken, Operator, Organization, OrganizationService } from './organization.service';
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
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    actions: {
      columnTitle: 'Действия',
      delete: false
    },
    columns: {
      name: {
        title: 'Имя',
        type: 'string',
      },
      email: {
        title: 'Email',
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

  public tokenSettings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true
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
        editable: false
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

  public organization: Organization;

  constructor(
    private route: ActivatedRoute,
    private service: OrganizationService
  ) {
    const organizationId: string = this.route.snapshot.paramMap.get('id');
    this.service.getOrganization().subscribe(organization => {
      this.organization = organization;
      this.operatorSource.load(organization.operators);
      this.tokenSource.load(organization.tokens)
    });
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

  /**
   * Добавление Ключа
   *
   * @param event
   */
  public onTokenCreateConfirm(event: any): void {
    this.service.createToken(new CompanyToken(event.newData))
      .toPromise()
      .then(result => {
        event.confirm.resolve(result);
      })
      .catch(error => {
        event.confirm.reject();
      });
  }

  /**
   *  Изменение Ключа
   *
   * @param event
   */
  public onTokenUpdateConfirm(event: any): void {
    this.service.updateToken(event.newData)
      .toPromise()
      .then(result => {
        event.confirm.resolve(result);
      })
      .catch(error => {
        event.confirm.reject();
      });
  }

  /**
   * Добавление Оператора
   *
   * @param event
   */
  public onOperatorCreateConfirm(event: any): void {
    this.service.createOperator({
        name: event.newData.name,
        email: event.newData.email,
        password: '12345',
        confirmPassword: '12345'
      })
      .toPromise()
      .then(result => {
        event.confirm.resolve();
      })
      .catch(error => {
        event.confirm.reject();
      });
  }

  /**
   * Редактирование Оператора
   *
   * @param event
   */
  public onOperatorUpdateConfirm(event: any): void {
    this.service.updateOperator(event.newData)
      .toPromise()
      .then(result => {
        event.confirm.resolve(result);
      })
      .catch(error => {
        event.confirm.reject();
      });
  }

}
