import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionNotiComponent } from './actionsNoti.component';

describe('ActionNotiComponent', () => {
  let component: ActionNotiComponent;
  let fixture: ComponentFixture<ActionNotiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionNotiComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionNotiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
