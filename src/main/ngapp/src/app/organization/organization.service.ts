import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class CompanyToken {
  public readonly token: string;
  public readonly name: string;
  public readonly disabled: 'Активен' | 'Блокирован';
}

export class Operator {
  public readonly token: string;
  public readonly email: string;
  public readonly name: string;
}

export class Organization {
  public readonly email: string;
  public readonly name: string;
}

@Injectable()
export class OrganizationService {

  constructor() { }

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

  private organizations: Organization[] = [
    {
      email: 'info@sportmaster.ru',
      name: 'СпортМастер'
    } as Organization,
    {
      email: 'info@remoto.ru',
      name: 'Remoto'
    } as Organization
  ];

  public getOperators(): Observable<Operator[]> {
    return Observable.of(this.operators);
  }

  public getTokens(): Observable<CompanyToken[]> {
    return Observable.of(this.tokens);
  }

  public getOrganizations(): Observable<Organization[]> {
    return Observable.of(this.organizations);
  }

  public getOrganization(id: string): Observable<Organization> {
    return Observable.of(this.organizations.find(organization => organization.email === id));
  }

}
