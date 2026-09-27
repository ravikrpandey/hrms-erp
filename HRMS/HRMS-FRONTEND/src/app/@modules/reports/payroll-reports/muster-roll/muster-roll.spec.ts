import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusterRoll } from './muster-roll';

describe('MusterRoll', () => {
  let component: MusterRoll;
  let fixture: ComponentFixture<MusterRoll>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MusterRoll]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MusterRoll);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
