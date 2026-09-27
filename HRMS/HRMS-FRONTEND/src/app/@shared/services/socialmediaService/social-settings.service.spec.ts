import { TestBed } from '@angular/core/testing';

import { SocialSettingsService } from './social-settings.service';

describe('SocialSettingsService', () => {
  let service: SocialSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SocialSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
