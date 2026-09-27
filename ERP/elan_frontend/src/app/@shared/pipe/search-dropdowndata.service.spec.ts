import { TestBed } from '@angular/core/testing';

import { SearchDropdowndataService } from './search-dropdowndata.service';

describe('SearchDropdowndataService', () => {
  let service: SearchDropdowndataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchDropdowndataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
