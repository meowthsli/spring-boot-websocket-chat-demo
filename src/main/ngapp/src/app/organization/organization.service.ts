import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

export class CompanyToken {
  public readonly token: string;
  public readonly active: 'Активен' | 'Блокирован';
}

export class Operator {
  public readonly token: string;
  public readonly email: string;
  public readonly name: string;
}

@Injectable()
export class OrganizationService {

  constructor() { }

  private tokens: CompanyToken[] = [
    {
      token: '111221212121212112',
      active: 'Активен'
    } as CompanyToken,
    {
      token: 'aabababababaababab',
      active: 'Активен'
    } as CompanyToken
  ];

  private operators: Operator[] = [
    {
      token: '111221212121212112',
      email: 'ivan@mail.ru',
      name: 'Иванов Иван'
    } as Operator,
    {
      token: 'aabababababaababab',
      email: 'petr@mail.ru',
      name: 'Петров Иван'
    } as Operator
  ];

  public getOperators(): Observable<Operator[]> {
    return Observable.of(this.operators);
  }

  public getTokens(): Observable<CompanyToken[]> {
    return Observable.of(this.tokens);
  }

}
