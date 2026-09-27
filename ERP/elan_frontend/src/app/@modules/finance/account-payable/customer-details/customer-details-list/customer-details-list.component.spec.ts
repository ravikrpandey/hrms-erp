import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerDetailsListComponent } from './customer-details-list.component';

describe('CustomerDetailsListComponent', () => {
  let component: CustomerDetailsListComponent;
  let fixture: ComponentFixture<CustomerDetailsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerDetailsListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerDetailsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
