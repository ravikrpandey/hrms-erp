import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AchievementDetailsComponent } from './achievement-details.component';

describe('AchievementDetailsComponent', () => {
  let component: AchievementDetailsComponent;
  let fixture: ComponentFixture<AchievementDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AchievementDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AchievementDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
