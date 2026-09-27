import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackoutsJdReportComponent } from './backouts-jd-report.component';

describe('BackoutsJdReportComponent', () => {
  let component: BackoutsJdReportComponent;
  let fixture: ComponentFixture<BackoutsJdReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BackoutsJdReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackoutsJdReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
