import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetRevenueDialogComponent } from './budget-revenue-dialog.component';

describe('BudgetRevenueDialogComponent', () => {
  let component: BudgetRevenueDialogComponent;
  let fixture: ComponentFixture<BudgetRevenueDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetRevenueDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetRevenueDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
