import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOfEmployee } from './register-of-employee';

describe('RegisterOfEmployee', () => {
  let component: RegisterOfEmployee;
  let fixture: ComponentFixture<RegisterOfEmployee>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterOfEmployee]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterOfEmployee);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
