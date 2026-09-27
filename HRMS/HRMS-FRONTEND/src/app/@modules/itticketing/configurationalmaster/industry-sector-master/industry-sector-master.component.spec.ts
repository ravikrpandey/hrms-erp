import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustrySectorMasterComponent } from './industry-sector-master.component';

describe('IndustrySectorMasterComponent', () => {
  let component: IndustrySectorMasterComponent;
  let fixture: ComponentFixture<IndustrySectorMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndustrySectorMasterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndustrySectorMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
