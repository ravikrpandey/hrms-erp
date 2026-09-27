import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterOfWorkman } from './register-of-workman';

describe('RegisterOfWorkman', () => {
  let component: RegisterOfWorkman;
  let fixture: ComponentFixture<RegisterOfWorkman>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterOfWorkman]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterOfWorkman);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
