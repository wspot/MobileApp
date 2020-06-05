import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzciDetailComponent } from './IzciDetail.component';

describe('IzciDetailComponent', () => {
  let component: IzciDetailComponent;
  let fixture: ComponentFixture<IzciDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IzciDetailComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzciDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
