import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileActionsComponent } from './actions.component';

describe('ActionsComponent', () => {
  let component: ProfileActionsComponent;
  let fixture: ComponentFixture<ProfileActionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileActionsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
