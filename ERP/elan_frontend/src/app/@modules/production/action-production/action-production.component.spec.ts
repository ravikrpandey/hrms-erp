import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionProductionComponent } from './action-production.component';

describe('ActionProductionComponent', () => {
  let component: ActionProductionComponent;
  let fixture: ComponentFixture<ActionProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionProductionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
