import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssetLogoComponent } from './asset-logo.component';

describe('AssetLogoComponent', () => {
  let component: AssetLogoComponent;
  let fixture: ComponentFixture<AssetLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssetLogoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AssetLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
