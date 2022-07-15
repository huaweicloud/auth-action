import * as iam from '../src/iam';
import * as core from '@actions/core';

const mockWithProjectId = jest.fn();
const mockShowPermanentAccessKey = jest.fn();
const mockKeystoneShowProject = jest.fn();

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
                                showPermanentAccessKey: mockShowPermanentAccessKey,
                                keystoneShowProject: mockKeystoneShowProject,
                            })),
                        })),
                    })),
                })),
            })),
        },
        ShowPermanentAccessKeyRequest: jest.fn(),
    };
});

describe('test show permanent access key', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('test show permanent access key when httpStatusCode is 200', async () => {
        mockShowPermanentAccessKey.mockImplementation(() => {
            return { httpStatusCode: 200 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4',
        };
        expect(mockWithProjectId).not.toHaveBeenCalled();
        expect(await iam.showPermanentAccessKey(input)).toBe(true);
    });

    test('test show permanent access key when httpStatusCode is not 200', async () => {
        mockShowPermanentAccessKey.mockImplementation(() => {
            return { httpStatusCode: 401 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4',
        };
        expect(await iam.showPermanentAccessKey(input)).toBe(false);
        expect(core.setFailed).toHaveBeenCalledTimes(1);
    });
});

describe('test keystone show project', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    test('test keystone show project when httpStatusCode is 200', async () => {
        mockKeystoneShowProject.mockImplementation(() => {
            return { httpStatusCode: 200 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '1234567890123456',
            region: 'cn-north-4',
        };

        expect(await iam.keystoneShowProject(input)).toBe(true);
        expect(mockWithProjectId).toHaveBeenCalled();
    });

    test('test keystone show project when httpStatusCode is not 200', async () => {
        mockKeystoneShowProject.mockImplementation(() => {
            return { httpStatusCode: 401 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '1234567890123456',
            region: 'cn-north-4',
        };
        expect(await iam.keystoneShowProject(input)).toBe(false);
        expect(core.setFailed).toHaveBeenCalledTimes(1);
    });

    test('test keystone show project when project id is empty', async () => {
        mockKeystoneShowProject.mockImplementation(() => {
            return { httpStatusCode: 401 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4',
        };
        expect(await iam.keystoneShowProject(input)).toBe(true);
        expect(mockKeystoneShowProject).not.toHaveBeenCalled();
    });
});
