import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArearSalaryList } from './arear-salary-list';

describe('ArearSalaryList', () => {
  let component: ArearSalaryList;
  let fixture: ComponentFixture<ArearSalaryList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArearSalaryList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArearSalaryList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
