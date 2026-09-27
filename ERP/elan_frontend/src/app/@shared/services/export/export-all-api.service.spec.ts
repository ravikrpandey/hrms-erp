import { TestBed } from '@angular/core/testing';

import { ExportAllApiService } from './export-all-api.service';

describe('ExportAllApiService', () => {
  let service: ExportAllApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExportAllApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
