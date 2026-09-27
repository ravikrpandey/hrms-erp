import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionPayableComponent } from './action-payable.component';

describe('ActionPayableComponent', () => {
  let component: ActionPayableComponent;
  let fixture: ComponentFixture<ActionPayableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionPayableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionPayableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
