import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetQRCodeComponent } from './asset-qr-code.component';

describe('AssetQRCodeComponent', () => {
  let component: AssetQRCodeComponent;
  let fixture: ComponentFixture<AssetQRCodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetQRCodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetQRCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
