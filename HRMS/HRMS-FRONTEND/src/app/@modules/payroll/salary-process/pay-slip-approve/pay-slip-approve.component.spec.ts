import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaySlipApproveComponent } from './pay-slip-approve.component';

describe('PaySlipApproveComponent', () => {
  let component: PaySlipApproveComponent;
  let fixture: ComponentFixture<PaySlipApproveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaySlipApproveComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaySlipApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
