import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignCompActionComponent } from './assign-comp-action.component';

describe('AssignCompActionComponent', () => {
  let component: AssignCompActionComponent;
  let fixture: ComponentFixture<AssignCompActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignCompActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignCompActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
