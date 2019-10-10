import { TestBed } from '@angular/core/testing';

import { InventariosService } from './inventarios.service';

describe('InventariosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: InventariosService = TestBed.get(InventariosService);
    expect(service).toBeTruthy();
  });
});
