import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMasterDialog } from './asset-master-dialog';

describe('AssetMasterDialog', () => {
  let component: AssetMasterDialog;
  let fixture: ComponentFixture<AssetMasterDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetMasterDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMasterDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
