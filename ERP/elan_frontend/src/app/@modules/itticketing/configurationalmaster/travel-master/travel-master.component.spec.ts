import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravelMasterComponent } from './travel-master.component';

describe('TravelMasterComponent', () => {
  let component: TravelMasterComponent;
  let fixture: ComponentFixture<TravelMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TravelMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravelMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
