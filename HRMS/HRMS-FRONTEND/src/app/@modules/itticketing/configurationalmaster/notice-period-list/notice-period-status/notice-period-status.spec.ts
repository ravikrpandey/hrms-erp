import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticePeriodStatus } from './notice-period-status';

describe('NoticePeriodStatus', () => {
  let component: NoticePeriodStatus;
  let fixture: ComponentFixture<NoticePeriodStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticePeriodStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticePeriodStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
