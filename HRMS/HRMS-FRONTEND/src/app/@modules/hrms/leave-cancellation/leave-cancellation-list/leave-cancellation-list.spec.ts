import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCancellationList } from './leave-cancellation-list';

describe('LeaveCancellationList', () => {
  let component: LeaveCancellationList;
  let fixture: ComponentFixture<LeaveCancellationList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveCancellationList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveCancellationList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
