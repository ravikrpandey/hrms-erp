import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoticePeriodAction } from './notice-period-action';

describe('NoticePeriodAction', () => {
  let component: NoticePeriodAction;
  let fixture: ComponentFixture<NoticePeriodAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NoticePeriodAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoticePeriodAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
