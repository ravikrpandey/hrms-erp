import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetMaster } from './asset-master';

describe('AssetMaster', () => {
  let component: AssetMaster;
  let fixture: ComponentFixture<AssetMaster>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetMaster]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetMaster);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
