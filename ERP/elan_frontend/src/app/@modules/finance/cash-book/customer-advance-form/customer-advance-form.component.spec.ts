import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAdvanceFormComponent } from './customer-advance-form.component';

describe('CustomerAdvanceFormComponent', () => {
  let component: CustomerAdvanceFormComponent;
  let fixture: ComponentFixture<CustomerAdvanceFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAdvanceFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAdvanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
