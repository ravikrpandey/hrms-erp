import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkStationCreateComponent } from './work-station-create.component';

describe('WorkStationCreateComponent', () => {
  let component: WorkStationCreateComponent;
  let fixture: ComponentFixture<WorkStationCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WorkStationCreateComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkStationCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
