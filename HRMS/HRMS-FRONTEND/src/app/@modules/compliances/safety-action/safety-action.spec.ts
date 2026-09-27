import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafetyAction } from './safety-action';

describe('SafetyAction', () => {
  let component: SafetyAction;
  let fixture: ComponentFixture<SafetyAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SafetyAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SafetyAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
