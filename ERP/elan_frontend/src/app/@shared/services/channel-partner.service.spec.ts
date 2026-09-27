import { TestBed } from '@angular/core/testing';

import { ChannelPartnerService } from './channel-partner.service';

describe('ChannelPartnerService', () => {
  let service: ChannelPartnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChannelPartnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
