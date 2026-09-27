import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionStoreComponent } from './action-store.component';

describe('ActionStoreComponent', () => {
  let component: ActionStoreComponent;
  let fixture: ComponentFixture<ActionStoreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionStoreComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionStoreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
