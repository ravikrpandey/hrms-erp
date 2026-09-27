import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoneTypestatusComponent } from './zone-typestatus.component';

describe('ZoneTypestatusComponent', () => {
  let component: ZoneTypestatusComponent;
  let fixture: ComponentFixture<ZoneTypestatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ZoneTypestatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ZoneTypestatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
