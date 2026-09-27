import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerTypeMasterComponent } from './customer-type-master.component';

describe('CustomerTypeMasterComponent', () => {
  let component: CustomerTypeMasterComponent;
  let fixture: ComponentFixture<CustomerTypeMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerTypeMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerTypeMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
