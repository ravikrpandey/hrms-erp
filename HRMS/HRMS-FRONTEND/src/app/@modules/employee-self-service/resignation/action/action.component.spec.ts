import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionComponentResignation } from './action.component';

describe('ActionComponent', () => {
  let component: ActionComponentResignation;
  let fixture: ComponentFixture<ActionComponentResignation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionComponentResignation ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionComponentResignation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
