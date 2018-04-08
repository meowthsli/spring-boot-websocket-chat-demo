import { User } from './user.model';

export class UserStore {

  constructor(private users: User[] = []) {

  }

  public addUser(user: User) {
    this.users = this.users.filter(u => u.login !== user.login).concat(user);
  }

  public find(login: string): User {
    return this.users.find(user => user.login === login);
  }

}
