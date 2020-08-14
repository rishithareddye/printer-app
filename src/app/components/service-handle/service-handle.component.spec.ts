import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceHandleComponent } from './service-handle.component';

describe('ServiceHandleComponent', () => {
  let component: ServiceHandleComponent;
  let fixture: ComponentFixture<ServiceHandleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ServiceHandleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ServiceHandleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
