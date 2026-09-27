import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CancelledLeave } from './cancelled-leave';

describe('CancelledLeave', () => {
  let component: CancelledLeave;
  let fixture: ComponentFixture<CancelledLeave>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CancelledLeave]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CancelledLeave);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
