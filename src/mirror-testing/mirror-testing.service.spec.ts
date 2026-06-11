import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MirrorRepository } from '../mirror/mirror.repository';
import { MirrorHttpProbeClient } from './mirror-http-probe.client';
import { MirrorTestingService } from './mirror-testing.service';
import { ScanResultRepository } from './scan-result.repository';

describe('MirrorTestingService', () => {
  let service: MirrorTestingService;

  const mirrorRepository = {
    findById: jest.fn(),
  };

  const scanResultRepository = {
    create: jest.fn(),
  };

  const httpProbeClient = {
    probe: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MirrorTestingService,
        { provide: MirrorRepository, useValue: mirrorRepository },
        { provide: ScanResultRepository, useValue: scanResultRepository },
        { provide: MirrorHttpProbeClient, useValue: httpProbeClient },
      ],
    }).compile();

    service = module.get(MirrorTestingService);
  });

  it('probes mirror URL and stores scan result', async () => {
    mirrorRepository.findById.mockResolvedValue({
      id: 'mirror-id',
      baseUrl: 'https://pypi.example.com',
    });
    httpProbeClient.probe.mockResolvedValue({
      statusCode: 200,
      isAvailable: true,
      packageSizeBytes: 1024,
      dnsLookupMs: 12,
      connectionMs: 34,
      totalResponseMs: 245,
    });
    scanResultRepository.create.mockResolvedValue({ id: 'scan-id' });

    const result = await service.testMirror('mirror-id');

    expect(httpProbeClient.probe).toHaveBeenCalledWith('https://pypi.example.com/simple/');
    expect(scanResultRepository.create).toHaveBeenCalledWith({
      mirrorId: 'mirror-id',
      responseTimeMs: 245,
      statusCode: 200,
      isAvailable: true,
      packageSizeBytes: 1024,
    });
    expect(result).toEqual({
      mirrorId: 'mirror-id',
      responseTimeMs: 245,
      statusCode: 200,
      isAvailable: true,
    });
  });

  it('throws when mirror is not found', async () => {
    mirrorRepository.findById.mockResolvedValue(null);

    await expect(service.testMirror('missing-id')).rejects.toThrow(NotFoundException);
    expect(httpProbeClient.probe).not.toHaveBeenCalled();
  });

  it('stores unavailable probe results', async () => {
    mirrorRepository.findById.mockResolvedValue({
      id: 'mirror-id',
      baseUrl: 'https://pypi.example.com',
    });
    httpProbeClient.probe.mockResolvedValue({
      statusCode: 503,
      isAvailable: false,
      packageSizeBytes: 0,
      dnsLookupMs: 5,
      connectionMs: 10,
      totalResponseMs: 120,
    });
    scanResultRepository.create.mockResolvedValue({ id: 'scan-id' });

    const result = await service.testMirrorUrl('mirror-id', 'https://pypi.example.com/simple/');

    expect(result).toEqual({
      mirrorId: 'mirror-id',
      responseTimeMs: 120,
      statusCode: 503,
      isAvailable: false,
    });
  });
});
