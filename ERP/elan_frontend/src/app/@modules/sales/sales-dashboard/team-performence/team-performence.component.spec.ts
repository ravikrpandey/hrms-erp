import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamPerformenceComponent } from './team-performence.component';

describe('TeamPerformenceComponent', () => {
  let component: TeamPerformenceComponent;
  let fixture: ComponentFixture<TeamPerformenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamPerformenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamPerformenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
