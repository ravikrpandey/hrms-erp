import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepreciationMasterComponent } from './depreciation-master.component';

describe('DepreciationMasterComponent', () => {
  let component: DepreciationMasterComponent;
  let fixture: ComponentFixture<DepreciationMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DepreciationMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepreciationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
