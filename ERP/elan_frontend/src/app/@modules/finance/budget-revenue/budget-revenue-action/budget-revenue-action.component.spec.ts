import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRevenueActionComponent } from './budget-revenue-action.component';

describe('BudgetRevenueActionComponent', () => {
  let component: BudgetRevenueActionComponent;
  let fixture: ComponentFixture<BudgetRevenueActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetRevenueActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetRevenueActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
