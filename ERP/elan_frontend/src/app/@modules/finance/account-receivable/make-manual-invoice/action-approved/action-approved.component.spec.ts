import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionApprovedComponent } from './action-approved.component';

describe('ActionApprovedComponent', () => {
  let component: ActionApprovedComponent;
  let fixture: ComponentFixture<ActionApprovedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionApprovedComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionApprovedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
