import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArearSalaryAction } from './arear-salary-action';

describe('ArearSalaryAction', () => {
  let component: ArearSalaryAction;
  let fixture: ComponentFixture<ArearSalaryAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArearSalaryAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArearSalaryAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
