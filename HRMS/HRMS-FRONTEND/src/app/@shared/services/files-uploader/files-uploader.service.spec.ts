import { TestBed } from '@angular/core/testing';
import { FilesUploaderService } from './files-uploader.service';

describe('FilesUploaderService', () => {
  let service: FilesUploaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FilesUploaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
