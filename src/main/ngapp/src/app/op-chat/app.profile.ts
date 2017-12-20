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
            <label for="login" style="">Логин</label>
            <input name="login" class="form-control" disabled="true" value="{{$email}}"/>
        </div>
        <div class="form-group">
            <label for="enterprise" style="">Ключ доступа</label>
            <input name="enterprise" class="form-control" disabled="true" value="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"/>
        </div>        
        <label for="fio" style="">ФИО (Имя [Отчество] [Фамилия])</label>
        <div class="input-group" style="padding-bottom:0.25rem;">           
            <input name="fio" class="form-control" disabled="true" value="Максим Фёдоров"/>
            <span class="input-group-btn" style="width:20%">
                <button class="btn btn-primary" disabled="true" style="width:100%" disabled="true">
                Обновить
                </button>
            </span>
        </div>
        <label for="fio" style="">Аватар</label>
        <div class="input-group;" style="display: flex; justify-content: space-between">            
            <div style='background-image: url("/assets/jack.png"); width:50px; height:50px; border-radius:45%; background-size: cover;'></div>
            <span class="input-group-btn" style="width:20%">
                <button class="btn btn-primary" disabled="true" style="width:100%" disabled="true">
                Загрузить
                </button>
            </span>
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