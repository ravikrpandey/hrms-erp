import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStationActionComponent } from './work-station-action.component';

describe('WorkStationActionComponent', () => {
  let component: WorkStationActionComponent;
  let fixture: ComponentFixture<WorkStationActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkStationActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkStationActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
