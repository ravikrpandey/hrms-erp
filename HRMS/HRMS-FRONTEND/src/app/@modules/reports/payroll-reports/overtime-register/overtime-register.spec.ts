import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OvertimeRegister } from './overtime-register';

describe('OvertimeRegister', () => {
  let component: OvertimeRegister;
  let fixture: ComponentFixture<OvertimeRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OvertimeRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OvertimeRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
