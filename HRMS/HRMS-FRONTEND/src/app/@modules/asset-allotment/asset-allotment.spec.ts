import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetAllotment } from './asset-allotment';

describe('AssetAllotment', () => {
  let component: AssetAllotment;
  let fixture: ComponentFixture<AssetAllotment>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssetAllotment]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetAllotment);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
