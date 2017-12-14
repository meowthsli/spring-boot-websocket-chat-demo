import { Component, NgModule } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ouchat-management',
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
            <label for="login">Логин администратора</label>
            <input name="login" class="form-control" disabled="true" value="{{$email}}"/>
        </div>

        <label>Операторы (максимум 3)</label>
        
        <div class="input-group" *ngFor="let _login of $logins" style="padding-bottom:0.25rem;">
            <input class="form-control" disabled="true" value="{{_login}}@acme.org"/>
            <span class="input-group-btn" style="width:20%">
                <button class="btn btn-danger" style="width:100%" disabled="true">
                Удалить
                </button>
            </span>
        </div>
        <div class="input-group" style="padding-bottom:0.25rem;">
            <input class="form-control" disabled="true" value=""/>
            <span class="input-group-btn" style="width:20%">
                <button class="btn btn-success" style="width:100%" disabled="true">
                Добавить
                </button>
            </span>
        </div>

        <label>Ключи доступа</label>
        <div class="input-group" style="padding-bottom:0.25rem;">
            <input class="form-control" disabled="true" value="1F1tAaz5x1HUXrCNLbtMDqcw6o5GNn4xqX"/>
            <span class="input-group-btn" style="width:20%">
                <button class="btn btn-warning" disabled="true" style="width:100%" disabled="true">
                Забанить
                </button>
            </span>
        </div>
        <div class="input-group" style="padding-bottom:0.25rem;">
            <input class="form-control" name="newKey" class="form-control" disabled="true" value=""/>
            <span class="input-group-btn" style="width:20%">
                <button class="btn btn-success" style="width:100%" disabled="true">
                Новый
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
export class SettingsComponent {
    public $modalHeader: string;
    public $email: string;
    public $logins = ['operator_2', 'operator_3'];

    public $closeModal() {
        this.activeModal.close();
    }

    constructor(private activeModal: NgbActiveModal) { }
}