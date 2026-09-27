import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalaryApprovalSlipComponent } from './salary-approval-slip.component';

describe('SalaryApprovalSlipComponent', () => {
  let component: SalaryApprovalSlipComponent;
  let fixture: ComponentFixture<SalaryApprovalSlipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalaryApprovalSlipComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalaryApprovalSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
