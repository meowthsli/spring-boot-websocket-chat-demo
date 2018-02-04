import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorChatComponent } from './operator-chat.component';

describe('OperatorChatComponent', () => {
  let component: OperatorChatComponent;
  let fixture: ComponentFixture<OperatorChatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OperatorChatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OperatorChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
