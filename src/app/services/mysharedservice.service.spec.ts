import { TestBed } from '@angular/core/testing';

import { MysharedserviceService } from './mysharedservice.service';

describe('MysharedserviceService', () => {
  let service: MysharedserviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MysharedserviceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
