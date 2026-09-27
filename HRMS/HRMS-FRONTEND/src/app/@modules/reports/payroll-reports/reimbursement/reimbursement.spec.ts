import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Reimbursement } from './reimbursement';

describe('Reimbursement', () => {
  let component: Reimbursement;
  let fixture: ComponentFixture<Reimbursement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Reimbursement]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Reimbursement);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
