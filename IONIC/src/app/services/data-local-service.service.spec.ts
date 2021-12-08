import { TestBed } from '@angular/core/testing';

import { DataLocalServiceService } from './data-local-service.service';

describe('DataLocalServiceService', () => {
  let service: DataLocalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataLocalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
