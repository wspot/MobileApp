import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingModalComponent } from './setting-modal.component';

describe('SettingModalComponent', () => {
  let component: SettingModalComponent;
  let fixture: ComponentFixture<SettingModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettingModalComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
