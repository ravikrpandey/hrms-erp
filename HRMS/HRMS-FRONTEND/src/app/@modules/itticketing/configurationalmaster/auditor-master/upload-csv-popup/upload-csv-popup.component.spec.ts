import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadCsvPopupComponent } from './upload-csv-popup.component';

describe('UploadCsvPopupComponent', () => {
  let component: UploadCsvPopupComponent;
  let fixture: ComponentFixture<UploadCsvPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadCsvPopupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadCsvPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
