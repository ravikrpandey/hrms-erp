import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApprovalActionComponent } from './customer-approval-action.component';

describe('CustomerApprovalActionComponent', () => {
  let component: CustomerApprovalActionComponent;
  let fixture: ComponentFixture<CustomerApprovalActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerApprovalActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerApprovalActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
