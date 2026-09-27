import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankRecieptReportComponent } from './bank-reciept-report.component';

describe('BankRecieptReportComponent', () => {
  let component: BankRecieptReportComponent;
  let fixture: ComponentFixture<BankRecieptReportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankRecieptReportComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BankRecieptReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
