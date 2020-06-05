import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MissionListComponent } from './MissionList.component';

describe('MissionListComponent', () => {
  let component: MissionListComponent;
  let fixture: ComponentFixture<MissionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MissionListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MissionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
