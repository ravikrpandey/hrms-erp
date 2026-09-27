import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TypeOfExpenseStatusComponent } from './type-of-expense-status.component';

describe('TypeOfExpenseStatusComponent', () => {
  let component: TypeOfExpenseStatusComponent;
  let fixture: ComponentFixture<TypeOfExpenseStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TypeOfExpenseStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TypeOfExpenseStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
