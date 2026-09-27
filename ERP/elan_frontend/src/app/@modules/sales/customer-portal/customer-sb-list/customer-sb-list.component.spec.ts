import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomerSbListComponent } from './customer-sb-list.component';

describe('CustomerSbListComponent', () => {
  let component: CustomerSbListComponent;
  let fixture: ComponentFixture<CustomerSbListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustomerSbListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomerSbListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
