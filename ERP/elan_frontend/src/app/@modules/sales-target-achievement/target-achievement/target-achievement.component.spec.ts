import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TargetAchievementComponent } from './target-achievement.component';

describe('TargetAchievementComponent', () => {
  let component: TargetAchievementComponent;
  let fixture: ComponentFixture<TargetAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TargetAchievementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TargetAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
