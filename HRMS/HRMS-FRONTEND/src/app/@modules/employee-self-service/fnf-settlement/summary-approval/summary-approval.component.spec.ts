import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryApprovalComponent } from './summary-approval.component';

describe('SummaryApprovalComponent', () => {
  let component: SummaryApprovalComponent;
  let fixture: ComponentFixture<SummaryApprovalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryApprovalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SummaryApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
