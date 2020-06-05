import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivityDetailSaveComponent } from './ActivityDetailSave.component';

describe('ActivityDetailSaveComponent', () => {
  let component: ActivityDetailSaveComponent;
  let fixture: ComponentFixture<ActivityDetailSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityDetailSaveComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivityDetailSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
