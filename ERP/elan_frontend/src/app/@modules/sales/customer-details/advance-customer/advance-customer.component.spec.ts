import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceCustomerComponent } from './advance-customer.component';

describe('AdvanceCustomerComponent', () => {
  let component: AdvanceCustomerComponent;
  let fixture: ComponentFixture<AdvanceCustomerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvanceCustomerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
