import { TestBed } from '@angular/core/testing';

import { ConfigurationalmasterService } from './configurationalmaster.service';

describe('ConfigurationalmasterService', () => {
  let service: ConfigurationalmasterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConfigurationalmasterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
