import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStationViewComponent } from './work-station-view.component';

describe('WorkStationViewComponent', () => {
  let component: WorkStationViewComponent;
  let fixture: ComponentFixture<WorkStationViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkStationViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkStationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
