import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CashRecieptReportComponent } from './cash-reciept-report.component';

describe('CashRecieptReportComponent', () => {
  let component: CashRecieptReportComponent;
  let fixture: ComponentFixture<CashRecieptReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CashRecieptReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CashRecieptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
