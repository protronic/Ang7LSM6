import { TestBed, inject } from '@angular/core/testing';

import { Lsm6Service } from './lsm6.service';

describe('Lsm6Service', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [Lsm6Service]
    });
  });

  it('should ...', inject([Lsm6Service], (service: Lsm6Service) => {
    expect(service).toBeTruthy();
  }));
});
