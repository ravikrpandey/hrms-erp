import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenerateIncomeStatementComponent } from './generate-income-statement.component';

describe('GenerateIncomeStatementComponent', () => {
  let component: GenerateIncomeStatementComponent;
  let fixture: ComponentFixture<GenerateIncomeStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenerateIncomeStatementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GenerateIncomeStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
