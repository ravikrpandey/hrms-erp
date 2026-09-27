import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PositionTimeReportComponent } from './position-time-report.component';

describe('PositionTimeReportComponent', () => {
  let component: PositionTimeReportComponent;
  let fixture: ComponentFixture<PositionTimeReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PositionTimeReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PositionTimeReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
