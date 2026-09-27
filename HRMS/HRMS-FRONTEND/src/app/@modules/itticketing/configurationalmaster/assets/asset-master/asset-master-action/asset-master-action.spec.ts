import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMasterAction } from './asset-master-action';

describe('AssetMasterAction', () => {
  let component: AssetMasterAction;
  let fixture: ComponentFixture<AssetMasterAction>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetMasterAction]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMasterAction);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
