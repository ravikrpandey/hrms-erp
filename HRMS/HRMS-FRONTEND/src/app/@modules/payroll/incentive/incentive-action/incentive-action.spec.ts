import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IncentiveAction } from './incentive-action';

describe('IncentiveAction', () => {
  let component: IncentiveAction;
  let fixture: ComponentFixture<IncentiveAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IncentiveAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IncentiveAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
