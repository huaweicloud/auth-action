import * as iam from '../src/iam';
import * as core from '@actions/core';

const mockWithProjectId = jest.fn();
const mockKeystoneShowRegion = jest.fn();

jest.mock('@actions/core');
jest.mock('@huaweicloud/huaweicloud-sdk-core', () => {
    return {
        BasicCredentials: jest.fn(() => ({
            withAk: jest.fn(() => ({
                withSk: jest.fn(() => ({
                    withProjectId: mockWithProjectId,
                })),
            })),
        })),
    };
});

jest.mock('@huaweicloud/huaweicloud-sdk-iam', () => {
    return {
        IamClient: {
            newBuilder: jest.fn(() => ({
                withCredential: jest.fn(() => ({
                    withEndpoint: jest.fn(() => ({
                        withOptions: jest.fn(() => ({
                            build: jest.fn(() => ({
                                keystoneShowRegion: mockKeystoneShowRegion,
                            })),
                        })),
                    })),
                })),
            })),
        },
        KeystoneShowRegionRequest: jest.fn(),
    };
});

describe('test show keystone region', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('test show keystone region when httpStatusCode is 200', async () => {
        mockKeystoneShowRegion.mockImplementation(() => {
            return { httpStatusCode: 200 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4',
        };
        expect(mockWithProjectId).not.toHaveBeenCalled();
        expect(await iam.keystoneShowRegion(input)).toBe(true);
    });

    test('test show permanent access key when httpStatusCode is not 200', async () => {
        mockKeystoneShowRegion.mockImplementation(() => {
            return { httpStatusCode: 401 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4',
        };
        expect(await iam.keystoneShowRegion(input)).toBe(false);
        expect(core.setFailed).toHaveBeenNthCalledWith(1, 'Keystone Show Region Request Error.');
    });

    test('test show keystone region whit project id', async () => {
        mockKeystoneShowRegion.mockImplementation(() => {
            return { httpStatusCode: 200 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '1234567890123456',
            region: 'cn-north-4',
        };

        expect(await iam.keystoneShowRegion(input)).toBe(true);
        expect(mockWithProjectId).toHaveBeenCalled();
    });

    test('test show keystone region whithout project id', async () => {
        mockKeystoneShowRegion.mockImplementation(() => {
            return { httpStatusCode: 200 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4',
        };
        expect(await iam.keystoneShowRegion(input)).toBe(true);
        expect(mockWithProjectId).not.toHaveBeenCalled();
    });

    test('test show keystone region throw error', async () => {
        mockKeystoneShowRegion.mockImplementation(() => {
            throw new Error('Server Error.');
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4',
        };
        expect(await iam.keystoneShowRegion(input)).toBe(false);
        expect(core.setFailed).toHaveBeenNthCalledWith(1, 'Keystone Show Region Failed.');
    });
});
