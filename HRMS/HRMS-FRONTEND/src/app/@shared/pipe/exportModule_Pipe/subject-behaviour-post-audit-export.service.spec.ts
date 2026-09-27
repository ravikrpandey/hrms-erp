import { TestBed } from '@angular/core/testing';

import { SubjectBehaviourPostAuditExportService } from './subject-behaviour-post-audit-export.service';

describe('SubjectBehaviourPostAuditExportService', () => {
  let service: SubjectBehaviourPostAuditExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SubjectBehaviourPostAuditExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
