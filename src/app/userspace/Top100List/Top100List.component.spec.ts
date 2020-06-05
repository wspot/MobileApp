import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Top100ListComponent } from './Top100List.component';

describe('Top100ListComponent', () => {
  let component: Top100ListComponent;
  let fixture: ComponentFixture<Top100ListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Top100ListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Top100ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
