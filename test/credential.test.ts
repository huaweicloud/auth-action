import * as credential from '../src/credential';
import * as core from '@actions/core';

jest.mock('@actions/core');

test('test export credentials thrice when projectId is empty ', async () => {
    const input = {
        accessKey: '1234567890&*',
        secretKey: '123456789012345678901234567890',
        projectId: '',
        region: 'cn-north-4',
    };

    await credential.exportCredentials(input);
    expect(core.setSecret).toHaveBeenCalledTimes(3);
    expect(core.exportVariable).toHaveBeenCalledTimes(3);
});

test('test export credentials four times when projectId is not empty ', async () => {
    const input = {
        accessKey: '1234567890',
        secretKey: '123456789012345678901234567890',
        projectId: '1234567890123456',
        region: 'cn-north-4',
    };

    await credential.exportCredentials(input);
    expect(core.setSecret).toHaveBeenCalledTimes(4);
    expect(core.exportVariable).toHaveBeenCalledTimes(4);
});
