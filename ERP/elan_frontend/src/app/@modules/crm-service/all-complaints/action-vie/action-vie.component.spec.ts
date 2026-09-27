import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionVieComponent } from './action-vie.component';

describe('ActionVieComponent', () => {
  let component: ActionVieComponent;
  let fixture: ComponentFixture<ActionVieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionVieComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionVieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
