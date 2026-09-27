import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetSaleWriteoffComponent } from './asset-sale-writeoff.component';

describe('AssetSaleWriteoffComponent', () => {
  let component: AssetSaleWriteoffComponent;
  let fixture: ComponentFixture<AssetSaleWriteoffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetSaleWriteoffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetSaleWriteoffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
