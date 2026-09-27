import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttedanceReportComponent } from './attedance-report.component';

describe('AttedanceReportComponent', () => {
  let component: AttedanceReportComponent;
  let fixture: ComponentFixture<AttedanceReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AttedanceReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttedanceReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
