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
  public readonly disabled: 'Активен' | 'Блокирован';

  constructor(private data: any) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.supervisor = data.supervisor;
    this.disabled = data.locked ? 'Блокирован' : 'Активен';
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

  /**
   * Получить Организации
   *
   * @returns {Observable<Organization>}
   */
  public getOrganization(): Observable<Organization> {
    return this.http.get('/api/organization').pipe(map(result => {
      return new Organization(result);
    }));
  }

  /**
   * Создать Ключ
   *
   * @param {CompanyToken} token
   * @returns {Observable<CompanyToken>}
   */
  public createToken(token: CompanyToken): Observable<CompanyToken> {
    return this.http.post<ICompanyToken>('/api/key', {
        name: token.name
      })
      .pipe(map(result => {
        return new CompanyToken(result);
      }))
  }

  /**
   * Обновить данные Ключа
   *
   * @param {CompanyToken} token
   * @returns {Observable<CompanyToken>}
   */
  public updateToken(token: CompanyToken): Observable<CompanyToken> {
    return this.http.post<ICompanyToken>('/api/key/' + token.id, {
        name: token.name,
        isBlocked: token.disabled === 'Блокирован'
      })
      .pipe(map(result => {
        return new CompanyToken(result);
      }))
  }

  /**
   * Создать Оператора
   *
   * @param {INewOperator} operator
   * @returns {Observable<Operator>}
   */
  public createOperator(operator: INewOperator): Observable<Operator> {
    return this.http.post<ICompanyToken>('/api/user', operator)
      .pipe(map(result => {
        return new Operator(result);
      }))
  }

  /**
   * Обновить Оператора
   *
   * @param {INewOperator} operator
   * @returns {Observable<Operator>}
   */
  public updateOperator(operator: Operator): Observable<Operator> {
    return this.http.patch<ICompanyToken>('/api/user', {
        name: operator.name,
        email: operator.email,
        locked: operator.disabled === 'Блокирован'
      })
      .pipe(map(result => {
        return new Operator(result);
      }))
  }

}
