import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

interface ICompanyToken {
  id: number;
  isBlocked: boolean;
  name: string;
  value: string;
}

export class CompanyToken {

  public readonly id: number;
  public readonly token: string;
  public readonly name: string;
  public readonly disabled: 'Активен' | 'Блокирован';

  constructor(private data: ICompanyToken) {
    this.id = data.id;
    this.token = data.value;
    this.name = data.name;
    this.disabled = data.isBlocked ? 'Блокирован' : 'Активен';
  }

}

interface INewOperator {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export class Operator {
  public readonly id: number;
  public readonly email: string;
  public readonly name: string;
  public readonly supervisor: boolean;
  public readonly disabled: boolean;

  constructor(data: any) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.supervisor = data.supervisor;
    this.disabled = data.locked;
  }

}

export class Organization {
  public readonly id: number;
  public readonly name: string;
  public readonly operators: Operator[];
  public readonly tokens: CompanyToken[];

  constructor (data: any) {
    this.id = data.id;
    this.name = data.name;
    this.operators = data.users.map(user => new Operator(user));
    this.tokens = data.keys.map(key => new CompanyToken(key));
  }

}

@Injectable()
export class OrganizationService {

  constructor(
    private http: HttpClient
  ) { }

  private tokens: CompanyToken[] = [
    {
      token: '111221212121212112',
      name: 'Ключ iOS',
      disabled: 'Активен'
    } as CompanyToken,
    {
      token: 'aabababababaababab',
      name: 'Ключ Android',
      disabled: 'Активен'
    } as CompanyToken
  ];

  private operators: Operator[] = [
    {
      email: 'ivan@mail.ru',
      name: 'Иванов Иван'
    } as Operator,
    {
      email: 'petr@mail.ru',
      name: 'Петров Иван'
    } as Operator
  ];

  // public getOrganization(id: string): Observable<Organization> {
  //   return Observable.of(this.organizations.find(organization => organization.email === id));
  // }

  public getOrganization(): Observable<Organization> {
    return this.http.get('/api/organization').pipe(map(result => {
      return new Organization(result);
    }));
  }

  public createToken(token: CompanyToken): Observable<CompanyToken> {
    return this.http.post<ICompanyToken>('/api/key', {
        name: token.name
      })
      .pipe(map(result => {
        return new CompanyToken(result);
      }))
  }

  public createOperator(operator: INewOperator): Observable<Operator> {
    return this.http.post<ICompanyToken>('/api/user', operator)
      .pipe(map(result => {
        debugger;
        return new Operator(result);
      }))
  }

}
