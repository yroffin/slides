import { TestBed, inject } from '@angular/core/testing';

import { DataCoreService } from './data-core.service';

describe('DataCoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataCoreService]
    });
  });

  it('should be created', inject([DataCoreService], (service: DataCoreService) => {
    expect(service).toBeTruthy();
  }));
});
