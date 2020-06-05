import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageListComponent } from './MessageList.component';

describe('MessageListComponent', () => {
  let component: MessageListComponent;
  let fixture: ComponentFixture<MessageListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
