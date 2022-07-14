import * as iam from '../src/iam';
import * as core from '@actions/core';

const mockWithSk = jest.fn();
const mockShowPermanentAccessKey = jest.fn();

jest.mock('@actions/core');
jest.mock('@huaweicloud/huaweicloud-sdk-core', () => {
    return {
        GlobalCredentials: jest.fn(() => ({
            withAk: jest.fn(() => ({
                withSk: mockWithSk
            }))
        }))
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
                                showPermanentAccessKey: mockShowPermanentAccessKey
                            }))
                        }))
                    }))
                }))
            }))
        },
        ShowPermanentAccessKeyRequest: jest.fn()
    };
});

describe('test swr create secret', () => {
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
            region: 'cn-north-4'
        };
        expect(await iam.showPermanentAccessKey(input)).toBe(true);
        expect(mockWithSk).toHaveBeenCalled();
    });

    test('test show permanent access key when httpStatusCode is not 200', async () => {
        mockShowPermanentAccessKey.mockImplementation(() => {
            return { httpStatusCode: 401 };
        });
        const input = {
            accessKey: '1234567890&*',
            secretKey: '123456789012345678901234567890',
            projectId: '',
            region: 'cn-north-4'
        };
        expect(await iam.showPermanentAccessKey(input)).toBe(false);
        expect(core.setFailed).toHaveBeenCalledTimes(1);
    });
});
