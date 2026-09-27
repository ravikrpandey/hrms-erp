import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BudgetExtendDialogComponent } from './budget-extend-dialog.component';

describe('BudgetExtendDialogComponent', () => {
  let component: BudgetExtendDialogComponent;
  let fixture: ComponentFixture<BudgetExtendDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BudgetExtendDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BudgetExtendDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
