export interface IUser {
  login: string;
  name: string;
  tags?: string[];
}

export class User {

  public login: string = '';
  public name: string = '';
  public tags: string[] = [];

  constructor(data: IUser) {
    this.login = data.login;
    this.name = data.name;
    this.tags = data.tags || [];
  }

}
