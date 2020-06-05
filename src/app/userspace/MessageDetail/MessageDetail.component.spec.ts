import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageDetailComponent } from './MessageDetail.component';

describe('MessageDetailComponent', () => {
  let component: MessageDetailComponent;
  let fixture: ComponentFixture<MessageDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageDetailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
