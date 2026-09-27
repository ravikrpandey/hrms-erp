import { TestBed } from '@angular/core/testing';
import { ManageRFPService } from './manage.service';


describe('ManageService', () => {
  let service: ManageRFPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageRFPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
