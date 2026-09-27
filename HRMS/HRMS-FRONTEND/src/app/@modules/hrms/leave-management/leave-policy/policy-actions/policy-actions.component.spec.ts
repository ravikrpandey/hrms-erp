import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyActionsComponent } from './policy-actions.component';

describe('PolicyActionsComponent', () => {
  let component: PolicyActionsComponent;
  let fixture: ComponentFixture<PolicyActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PolicyActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
