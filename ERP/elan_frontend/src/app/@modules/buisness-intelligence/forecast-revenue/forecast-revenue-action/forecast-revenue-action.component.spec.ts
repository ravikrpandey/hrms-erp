import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionJobComponent } from './forecast-revenue-action.component';

describe('ActionJobComponent', () => {
  let component: ActionJobComponent;
  let fixture: ComponentFixture<ActionJobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionJobComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionJobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
