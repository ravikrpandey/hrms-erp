import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LevelSlabComponent } from './level-slab.component';

describe('LevelSlabComponent', () => {
  let component: LevelSlabComponent;
  let fixture: ComponentFixture<LevelSlabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LevelSlabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LevelSlabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
