import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApprovalCreateComponent } from './customer-approval-create.component';

describe('CustomerApprovalCreateComponent', () => {
  let component: CustomerApprovalCreateComponent;
  let fixture: ComponentFixture<CustomerApprovalCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerApprovalCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerApprovalCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
