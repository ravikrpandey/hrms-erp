import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcknowledgeActionComponent } from './acknowledge-action.component';

describe('AcknowledgeActionComponent', () => {
  let component: AcknowledgeActionComponent;
  let fixture: ComponentFixture<AcknowledgeActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcknowledgeActionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AcknowledgeActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
