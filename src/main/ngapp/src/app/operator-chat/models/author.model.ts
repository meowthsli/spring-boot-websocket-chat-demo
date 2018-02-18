export interface IAuthor {
  id: string;
  operatorId: string;
  fullname: string;
}

export class Author {

  public id: string = null;
  public operatorId: string = null;
  public fullname: string = '';

  constructor(data: IAuthor) {
    this.id = data.id;
    this.operatorId = data.operatorId;
    this.fullname = data.fullname;
  }

}
