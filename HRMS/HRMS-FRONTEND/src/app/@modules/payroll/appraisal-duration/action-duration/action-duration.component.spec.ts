import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDurationComponent } from './action-duration.component';

describe('ActionDurationComponent', () => {
  let component: ActionDurationComponent;
  let fixture: ComponentFixture<ActionDurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionDurationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
