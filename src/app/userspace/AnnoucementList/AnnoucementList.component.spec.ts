import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnoucementListComponent } from './AnnoucementList.component';

describe('AnnoucementListComponent', () => {
  let component: AnnoucementListComponent;
  let fixture: ComponentFixture<AnnoucementListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AnnoucementListComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoucementListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
