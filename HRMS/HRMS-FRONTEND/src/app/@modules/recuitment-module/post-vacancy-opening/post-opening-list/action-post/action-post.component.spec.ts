import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPostComponent } from './action-post.component';

describe('ActionTwoComponent', () => {
  let component: ActionPostComponent;
  let fixture: ComponentFixture<ActionPostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPostComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
