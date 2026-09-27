import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityMasterActionComponent } from './city-master-action.component';

describe('CityMasterActionComponent', () => {
  let component: CityMasterActionComponent;
  let fixture: ComponentFixture<CityMasterActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityMasterActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityMasterActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
