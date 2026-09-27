import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRevenueComponent } from './budget-revenue.component';

describe('BudgetRevenueComponent', () => {
  let component: BudgetRevenueComponent;
  let fixture: ComponentFixture<BudgetRevenueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetRevenueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetRevenueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
