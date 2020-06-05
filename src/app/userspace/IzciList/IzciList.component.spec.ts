import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IzciListComponent } from './IzciList.component';
import { ActivatedRoute } from '@angular/router';

describe('IzciListComponent', () => {
  let component: IzciListComponent;
  let fixture: ComponentFixture<IzciListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [IzciListComponent],
      providers: [{ provide: ActivatedRoute, useValue: ActivatedRoute }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IzciListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
