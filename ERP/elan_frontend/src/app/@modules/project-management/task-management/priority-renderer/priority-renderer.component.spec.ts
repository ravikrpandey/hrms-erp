import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriorityRendererComponent } from './priority-renderer.component';

describe('PriorityRendererComponent', () => {
  let component: PriorityRendererComponent;
  let fixture: ComponentFixture<PriorityRendererComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PriorityRendererComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriorityRendererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
