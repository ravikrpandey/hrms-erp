import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantSampleListComponent } from './plant-sample-list.component';

describe('PlantSampleListComponent', () => {
  let component: PlantSampleListComponent;
  let fixture: ComponentFixture<PlantSampleListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantSampleListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantSampleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
