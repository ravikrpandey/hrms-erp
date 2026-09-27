import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerApprovalComponent } from './customer-approval.component';

describe('CustomerApprovalComponent', () => {
  let component: CustomerApprovalComponent;
  let fixture: ComponentFixture<CustomerApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
