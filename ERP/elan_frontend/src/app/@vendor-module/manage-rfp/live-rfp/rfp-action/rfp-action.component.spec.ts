import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RfpActionComponent } from './rfp-action.component';

describe('RfpActionComponent', () => {
  let component: RfpActionComponent;
  let fixture: ComponentFixture<RfpActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RfpActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RfpActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
