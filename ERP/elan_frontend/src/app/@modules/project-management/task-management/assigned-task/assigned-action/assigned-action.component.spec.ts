import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignedActionComponent } from './assigned-action.component';

describe('AssignedActionComponent', () => {
  let component: AssignedActionComponent;
  let fixture: ComponentFixture<AssignedActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignedActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssignedActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
