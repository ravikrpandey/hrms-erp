import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddGstIoReportComponent } from './add-gst-io-report.component';

describe('AddGstIoReportComponent', () => {
  let component: AddGstIoReportComponent;
  let fixture: ComponentFixture<AddGstIoReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddGstIoReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddGstIoReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
