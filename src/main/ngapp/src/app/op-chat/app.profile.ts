import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ouchat-modal',
  template: `
    <div class="modal-header">
      <span>{{ $modalHeader }}</span>
      <button class="close" aria-label="Close" (click)="$closeModal()">
        <span aria-hidden="true">&times;</span>
      </button>
    </div>
    <div class="modal-body">
    <form>
        <div class="form-group">
            <label for="login" style="color:#a4abb3">Логин</label>
            <input name="login" class="form-control" disabled="true" value="{{$email}}"/>
        </div>
        <div class="form-group">
            <label for="enterprise" style="color:#a4abb3">Ключ доступа</label>
            <input name="enterprise" class="form-control" disabled="true" value="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"/>
        </div>
        <div class="form-group">
            <label for="fio" style="color:#a4abb3">Имя оператора</label>
            <input name="fio" class="form-control" disabled="true" value="Максим Орешкин"/>
        </div>
    </form>
    </div>
    <div class="modal-footer">
      <button class="btn btn-md btn-primary" (click)="$closeModal()">Закрыть</button>
    </div>
  `,
})
export class ProfileComponent {
    public $modalHeader: string;
    public $email: string;

    public $closeModal() {
        this.activeModal.close();
    }

    constructor(private activeModal: NgbActiveModal) { }
}