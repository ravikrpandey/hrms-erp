import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncomeStatementActionComponent } from './income-statement-action.component';

describe('IncomeStatementActionComponent', () => {
  let component: IncomeStatementActionComponent;
  let fixture: ComponentFixture<IncomeStatementActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IncomeStatementActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncomeStatementActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
