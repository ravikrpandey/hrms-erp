import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionAnnouncementComponent } from './action-announcement.component';

describe('ActionAnnouncementComponent', () => {
  let component: ActionAnnouncementComponent;
  let fixture: ComponentFixture<ActionAnnouncementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActionAnnouncementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActionAnnouncementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
