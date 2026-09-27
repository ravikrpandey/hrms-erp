import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LateReportComponent } from './late-report.component';

describe('LateReportComponent', () => {
  let component: LateReportComponent;
  let fixture: ComponentFixture<LateReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LateReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LateReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
