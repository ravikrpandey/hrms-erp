import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReimburseMasterComponent } from './reimbursement-master.component';

describe('ReimburseMasterComponent', () => {
  let component: ReimburseMasterComponent;
  let fixture: ComponentFixture<ReimburseMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReimburseMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReimburseMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
