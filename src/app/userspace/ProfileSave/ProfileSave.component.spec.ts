import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileSaveComponent } from './ProfileSave.component';

describe('ProfileSaveComponent', () => {
  let component: ProfileSaveComponent;
  let fixture: ComponentFixture<ProfileSaveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileSaveComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileSaveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
