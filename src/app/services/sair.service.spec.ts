import { TestBed } from '@angular/core/testing';

import { SairService } from './sair.service';

describe('SairService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SairService = TestBed.get(SairService);
    expect(service).toBeTruthy();
  });
});
