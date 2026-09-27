import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HsnSacListComponent } from './hsn-sac-list.component';

describe('HsnSacListComponent', () => {
  let component: HsnSacListComponent;
  let fixture: ComponentFixture<HsnSacListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HsnSacListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HsnSacListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
