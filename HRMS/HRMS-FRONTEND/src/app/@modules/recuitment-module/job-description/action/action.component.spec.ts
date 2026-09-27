import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionTwoComponent } from './action.component';

describe('ActionTwoComponent', () => {
  let component: ActionTwoComponent;
  let fixture: ComponentFixture<ActionTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionTwoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
