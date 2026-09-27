import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArearSalaryCreate } from './arear-salary-create';

describe('ArearSalaryCreate', () => {
  let component: ArearSalaryCreate;
  let fixture: ComponentFixture<ArearSalaryCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArearSalaryCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ArearSalaryCreate);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
