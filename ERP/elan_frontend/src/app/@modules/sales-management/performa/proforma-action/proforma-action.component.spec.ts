import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProformaActionComponent } from './proforma-action.component';

describe('ProformaActionComponent', () => {
  let component: ProformaActionComponent;
  let fixture: ComponentFixture<ProformaActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProformaActionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProformaActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
