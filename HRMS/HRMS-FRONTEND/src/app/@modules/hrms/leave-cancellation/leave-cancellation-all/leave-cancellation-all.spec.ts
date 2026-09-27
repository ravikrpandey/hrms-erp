import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaveCancellationAll } from './leave-cancellation-all';

describe('LeaveCancellationAll', () => {
  let component: LeaveCancellationAll;
  let fixture: ComponentFixture<LeaveCancellationAll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeaveCancellationAll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeaveCancellationAll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
