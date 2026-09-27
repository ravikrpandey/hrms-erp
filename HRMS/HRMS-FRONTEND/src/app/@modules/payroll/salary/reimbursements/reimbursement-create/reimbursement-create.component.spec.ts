import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimbursementCreateComponent } from './reimbursement-create.component';

describe('ReimbursementCreateComponent', () => {
  let component: ReimbursementCreateComponent;
  let fixture: ComponentFixture<ReimbursementCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimbursementCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimbursementCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
