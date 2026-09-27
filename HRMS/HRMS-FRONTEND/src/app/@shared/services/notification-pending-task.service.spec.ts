import { TestBed } from '@angular/core/testing';

import { NotificationPendingTaskService } from './notification-pending-task.service';

describe('NotificationPendingTaskService', () => {
  let service: NotificationPendingTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationPendingTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
