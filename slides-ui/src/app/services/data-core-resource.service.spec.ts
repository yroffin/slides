import { TestBed, inject } from '@angular/core/testing';

import { DataCoreResourceService } from './data-core-resource.service';

describe('DataCoreResourceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataCoreResourceService]
    });
  });

  it('should be created', inject([DataCoreResourceService], (service: DataCoreResourceService) => {
    expect(service).toBeTruthy();
  }));
});
