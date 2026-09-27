import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvanceRegister } from './advance-register';

describe('AdvanceRegister', () => {
  let component: AdvanceRegister;
  let fixture: ComponentFixture<AdvanceRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvanceRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvanceRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
