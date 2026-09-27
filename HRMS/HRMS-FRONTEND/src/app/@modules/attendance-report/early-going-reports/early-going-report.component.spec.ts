import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EarlyGoingReportComponent } from './early-going-report.component';

describe('EarlyGoingReportComponent', () => {
  let component: EarlyGoingReportComponent;
  let fixture: ComponentFixture<EarlyGoingReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EarlyGoingReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EarlyGoingReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
