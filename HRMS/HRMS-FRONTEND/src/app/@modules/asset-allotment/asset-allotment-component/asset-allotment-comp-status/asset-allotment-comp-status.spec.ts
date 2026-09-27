import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllotmentCompStatus } from './asset-allotment-comp-status';

describe('AssetAllotmentCompStatus', () => {
  let component: AssetAllotmentCompStatus;
  let fixture: ComponentFixture<AssetAllotmentCompStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAllotmentCompStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAllotmentCompStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
