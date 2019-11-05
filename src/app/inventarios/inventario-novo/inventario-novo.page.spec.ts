import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InventarioNovoPage } from './inventario-novo.page';

describe('InventarioNovoPage', () => {
  let component: InventarioNovoPage;
  let fixture: ComponentFixture<InventarioNovoPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InventarioNovoPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InventarioNovoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
