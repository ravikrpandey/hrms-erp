import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlantMasterViewComponent } from './plant-master-view.component';

describe('PlantMasterViewComponent', () => {
  let component: PlantMasterViewComponent;
  let fixture: ComponentFixture<PlantMasterViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlantMasterViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlantMasterViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
