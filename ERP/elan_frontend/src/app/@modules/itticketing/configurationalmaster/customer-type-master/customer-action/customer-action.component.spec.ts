import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerActionComponent } from './customer-action.component';

describe('CustomerActionComponent', () => {
  let component: CustomerActionComponent;
  let fixture: ComponentFixture<CustomerActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
