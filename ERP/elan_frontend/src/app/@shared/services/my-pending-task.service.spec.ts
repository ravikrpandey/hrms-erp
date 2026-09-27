import { TestBed } from '@angular/core/testing';

import { MyPendingTaskService } from './my-pending-task.service';

describe('MyPendingTaskService', () => {
  let service: MyPendingTaskService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyPendingTaskService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
