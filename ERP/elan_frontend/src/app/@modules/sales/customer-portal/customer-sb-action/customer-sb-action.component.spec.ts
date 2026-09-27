import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSbActionComponent } from './customer-sb-action.component';

describe('CustomerSbActionComponent', () => {
  let component: CustomerSbActionComponent;
  let fixture: ComponentFixture<CustomerSbActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSbActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSbActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
