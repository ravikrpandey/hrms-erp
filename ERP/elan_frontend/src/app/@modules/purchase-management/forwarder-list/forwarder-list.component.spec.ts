import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForwarderListComponent } from './forwarder-list.component';

describe('ForwarderListComponent', () => {
  let component: ForwarderListComponent;
  let fixture: ComponentFixture<ForwarderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ForwarderListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForwarderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
