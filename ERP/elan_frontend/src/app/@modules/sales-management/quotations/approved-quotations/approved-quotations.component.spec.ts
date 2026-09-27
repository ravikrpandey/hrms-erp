import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedQuotationsComponent } from './approved-quotations.component';

describe('ApprovedQuotationsComponent', () => {
  let component: ApprovedQuotationsComponent;
  let fixture: ComponentFixture<ApprovedQuotationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ApprovedQuotationsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedQuotationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
