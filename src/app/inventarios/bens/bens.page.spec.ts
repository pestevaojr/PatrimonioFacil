import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BensPage } from './bens.page';

describe('BensPage', () => {
  let component: BensPage;
  let fixture: ComponentFixture<BensPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BensPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BensPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
