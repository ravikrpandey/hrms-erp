import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerProductPriceComponent } from './customer-product-price.component';

describe('CustomerProductPriceComponent', () => {
  let component: CustomerProductPriceComponent;
  let fixture: ComponentFixture<CustomerProductPriceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerProductPriceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerProductPriceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
