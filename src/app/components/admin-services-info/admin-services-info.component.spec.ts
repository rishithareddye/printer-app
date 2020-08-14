import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminServicesInfoComponent } from './admin-services-info.component';

describe('AdminServicesInfoComponent', () => {
  let component: AdminServicesInfoComponent;
  let fixture: ComponentFixture<AdminServicesInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminServicesInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminServicesInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
