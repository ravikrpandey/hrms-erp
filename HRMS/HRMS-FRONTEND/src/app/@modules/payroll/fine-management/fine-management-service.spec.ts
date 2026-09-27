import { TestBed } from '@angular/core/testing';

import { FineManagementService } from './fine-management-service';

describe('FineManagementService', () => {
  let service: FineManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FineManagementService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
