import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityMasterDialogComponent } from './city-master-dialog.component';

describe('CityMasterDialogComponent', () => {
  let component: CityMasterDialogComponent;
  let fixture: ComponentFixture<CityMasterDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CityMasterDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CityMasterDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
