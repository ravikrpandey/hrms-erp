import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesTargetAchievementComponent } from './sales-target-achievement.component';

describe('SalesTargetAchievementComponent', () => {
  let component: SalesTargetAchievementComponent;
  let fixture: ComponentFixture<SalesTargetAchievementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SalesTargetAchievementComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SalesTargetAchievementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
