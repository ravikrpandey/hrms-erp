import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerAgingListComponent } from './customer-aging-list.component';

describe('CustomerAgingListComponent', () => {
  let component: CustomerAgingListComponent;
  let fixture: ComponentFixture<CustomerAgingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerAgingListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerAgingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
