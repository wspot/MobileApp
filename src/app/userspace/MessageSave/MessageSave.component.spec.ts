import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MessageSaveComponent } from './MessageSave.component';

describe('MessageSaveComponent', () => {
  let component: MessageSaveComponent;
  let fixture: ComponentFixture<MessageSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MessageSaveComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MessageSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
