import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignComplainActionComponent } from './assign-complain-action.component';

describe('AssignComplainActionComponent', () => {
  let component: AssignComplainActionComponent;
  let fixture: ComponentFixture<AssignComplainActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignComplainActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignComplainActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
