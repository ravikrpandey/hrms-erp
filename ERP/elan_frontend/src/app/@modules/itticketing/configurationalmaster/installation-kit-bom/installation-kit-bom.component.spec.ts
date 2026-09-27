import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstallationKitBomComponent } from './installation-kit-bom.component';

describe('InstallationKitBomComponent', () => {
  let component: InstallationKitBomComponent;
  let fixture: ComponentFixture<InstallationKitBomComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InstallationKitBomComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstallationKitBomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
