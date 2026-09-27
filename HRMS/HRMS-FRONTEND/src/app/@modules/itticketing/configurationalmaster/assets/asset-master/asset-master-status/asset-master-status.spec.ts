import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMasterStatus } from './asset-master-status';

describe('AssetMasterStatus', () => {
  let component: AssetMasterStatus;
  let fixture: ComponentFixture<AssetMasterStatus>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetMasterStatus]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMasterStatus);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
