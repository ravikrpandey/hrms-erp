import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LorryDetailsComponent } from './lorry-details.component';

describe('LorryDetailsComponent', () => {
  let component: LorryDetailsComponent;
  let fixture: ComponentFixture<LorryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LorryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LorryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
