import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptActionComponent } from './empt-action.component';

describe('EmptActionComponent', () => {
  let component: EmptActionComponent;
  let fixture: ComponentFixture<EmptActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmptActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
