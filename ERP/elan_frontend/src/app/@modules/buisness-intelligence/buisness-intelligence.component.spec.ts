import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuisnessIntelligenceComponent } from './buisness-intelligence.component';

describe('BuisnessIntelligenceComponent', () => {
  let component: BuisnessIntelligenceComponent;
  let fixture: ComponentFixture<BuisnessIntelligenceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BuisnessIntelligenceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuisnessIntelligenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
