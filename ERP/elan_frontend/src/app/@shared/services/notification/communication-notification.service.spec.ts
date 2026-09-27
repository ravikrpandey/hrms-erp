import { TestBed } from '@angular/core/testing';

import { CommunicationNotificationService } from './communication-notification.service';

describe('CommunicationNotificationService', () => {
  let service: CommunicationNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommunicationNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
