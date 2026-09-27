import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WageRegister } from './wage-register';

describe('WageRegister', () => {
  let component: WageRegister;
  let fixture: ComponentFixture<WageRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WageRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WageRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
