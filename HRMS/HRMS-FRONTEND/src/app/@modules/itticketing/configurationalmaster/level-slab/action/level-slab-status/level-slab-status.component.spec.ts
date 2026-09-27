import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSlabStatusComponent } from './level-slab-status.component';

describe('LevelSlabStatusComponent', () => {
  let component: LevelSlabStatusComponent;
  let fixture: ComponentFixture<LevelSlabStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelSlabStatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelSlabStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
