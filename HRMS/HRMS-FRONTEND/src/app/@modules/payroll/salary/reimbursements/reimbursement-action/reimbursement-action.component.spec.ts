import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementActionComponent } from './reimbursement-action.component';

describe('ReimbursementActionComponent', () => {
  let component: ReimbursementActionComponent;
  let fixture: ComponentFixture<ReimbursementActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
