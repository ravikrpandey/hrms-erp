import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionDupComponent } from './actions.component';

describe('ActionDupComponent', () => {
  let component: ActionDupComponent;
  let fixture: ComponentFixture<ActionDupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionDupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionDupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
