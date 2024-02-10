import { TestBed } from '@angular/core/testing';

import { EmpleadoServicesService } from './empleado.service';

describe('EmpleadoServicesService', () => {
  let service: EmpleadoServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EmpleadoServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
