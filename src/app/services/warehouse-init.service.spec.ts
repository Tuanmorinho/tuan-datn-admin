import { TestBed } from '@angular/core/testing';

import { WarehouseInitService } from './warehouse-init.service';

describe('WarehouseInitService', () => {
  let service: WarehouseInitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WarehouseInitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
