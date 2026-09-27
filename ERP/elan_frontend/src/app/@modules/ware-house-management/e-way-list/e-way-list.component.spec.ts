import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EWayListComponent } from './e-way-list.component';

describe('EWayListComponent', () => {
  let component: EWayListComponent;
  let fixture: ComponentFixture<EWayListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EWayListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EWayListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
