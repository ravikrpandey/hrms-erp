import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllotmentCompDialog } from './asset-allotment-comp-dialog';

describe('AssetAllotmentCompDialog', () => {
  let component: AssetAllotmentCompDialog;
  let fixture: ComponentFixture<AssetAllotmentCompDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAllotmentCompDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAllotmentCompDialog);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
