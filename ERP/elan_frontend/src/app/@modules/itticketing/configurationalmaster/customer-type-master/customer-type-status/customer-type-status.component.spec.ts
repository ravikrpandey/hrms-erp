import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTypeStatusComponent } from './customer-type-status.component';

describe('CustomerTypeStatusComponent', () => {
  let component: CustomerTypeStatusComponent;
  let fixture: ComponentFixture<CustomerTypeStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTypeStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTypeStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
