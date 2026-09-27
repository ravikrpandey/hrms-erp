import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionProjectListComponent } from './action-project-list.component';

describe('ActionProjectListComponent', () => {
  let component: ActionProjectListComponent;
  let fixture: ComponentFixture<ActionProjectListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionProjectListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionProjectListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
