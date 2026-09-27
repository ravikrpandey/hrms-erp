import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionMyProjectsComponent } from './action-my-projects.component';

describe('ActionMyProjectsComponent', () => {
  let component: ActionMyProjectsComponent;
  let fixture: ComponentFixture<ActionMyProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionMyProjectsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionMyProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
