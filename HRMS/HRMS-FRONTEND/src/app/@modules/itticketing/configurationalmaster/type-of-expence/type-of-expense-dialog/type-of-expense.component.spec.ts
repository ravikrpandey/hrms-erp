import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfExpenseDialogComponent } from './type-of-expense-dialog.component';

describe('TypeOfExpenseDialogComponent', () => {
  let component: TypeOfExpenseDialogComponent;
  let fixture: ComponentFixture<TypeOfExpenseDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfExpenseDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfExpenseDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
