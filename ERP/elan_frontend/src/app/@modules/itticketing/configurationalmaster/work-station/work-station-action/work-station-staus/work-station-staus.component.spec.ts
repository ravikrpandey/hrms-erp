import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStationStausComponent } from './work-station-staus.component';

describe('WorkStationStausComponent', () => {
  let component: WorkStationStausComponent;
  let fixture: ComponentFixture<WorkStationStausComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkStationStausComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkStationStausComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
