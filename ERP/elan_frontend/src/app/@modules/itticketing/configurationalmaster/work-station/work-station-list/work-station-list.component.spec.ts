import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStationListComponent } from './work-station-list.component';

describe('WorkStationListComponent', () => {
  let component: WorkStationListComponent;
  let fixture: ComponentFixture<WorkStationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkStationListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkStationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
