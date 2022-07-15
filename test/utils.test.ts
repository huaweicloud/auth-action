import * as utils from '../src/utils';

beforeEach(() => {
    jest.resetAllMocks();
});

describe('test check input is valid', () => {
    const testCase = [
        {
            description: 'aksk, projectId, region合法',
            inputs: {
                accessKey: '1234567890',
                secretKey: '123456789012345678901234567890',
                projectId: '1234567890123456',
                region: 'cn-north-4',
            },
            result: true,
        },
        {
            description: 'aksk不合法, projectId, region合法',
            inputs: {
                accessKey: '123',
                secretKey: '123456789012345678901234567890',
                projectId: '1234567890123456',
                region: 'cn-north-4',
            },
            result: false,
        },
        {
            description: 'aksk合法, projectId不合法, region合法',
            inputs: {
                accessKey: '1234567890',
                secretKey: '123456789012345678901234567890',
                projectId: '1234',
                region: 'cn-north-4',
            },
            result: false,
        },
        {
            description: 'aksk, projectId合法, region不合法',
            inputs: {
                accessKey: '1234567890',
                secretKey: '123456789012345678901234567890',
                projectId: '1234567890123456',
                region: 'cn-north4',
            },
            result: false,
        },
        {
            description: 'aksk, projectId, region都不合法',
            inputs: { accessKey: '1230', secretKey: '12345', projectId: '1234567', region: 'cn' },
            result: false,
        },
    ];
    testCase.forEach((item) => {
        const { description, inputs, result } = item;
        test(`${description},判断结果：${result}`, async () => {
            expect(utils.checkInputs(inputs)).toBe(result);
        });
    });
});

describe('test whether the aksk parameter is valid', () => {
    const testCase = [
        {
            accessKey: '1234567890',
            secretKey: '123456789012345678901234567890',
            result: true,
        },
        { accessKey: '', secretKey: '', result: false },
        { accessKey: '', secretKey: '123456789012345678901234567890', result: false },
        { accessKey: '1234567890', secretKey: '', result: false },
        {
            accessKey: '12345',
            secretKey: '123456789012345678901234567890',
            result: false,
        },
        { accessKey: '1234567890', secretKey: '1234567890', result: false },
        {
            accessKey: '1234567890123456789012345678901',
            secretKey: '123456789012345678901234567890123456789012345678901',
            result: false,
        },
        {
            accessKey: '1234567890123456789012345678901',
            secretKey: '123456789012345678901234567890',
            result: false,
        },
        {
            accessKey: '1234567890',
            secretKey: '123456789012345678901234567890123456789012345678901',
            result: false,
        },
        {
            accessKey: '1234%^890',
            secretKey: '1234567890123456#$12345678901234567890',
            result: false,
        },
    ];
    testCase.forEach((item) => {
        const { accessKey, secretKey, result } = item;
        test(`AK,SK输入为(${accessKey})and(${secretKey})，校验结果为${result}`, () => {
            expect(utils.checkAkSk(accessKey, secretKey)).toBe(result);
        });
    });
});

describe('test whether the projectId parameter is valid', () => {
    const testCase = [
        { projectId: '1234567890123456', result: true },
        { projectId: '', result: true },
        { projectId: '1234567890', result: false },
        {
            projectId: '12345678901234567890123456789012345678901234567890123456789012345',
            result: false,
        },
        { projectId: '123456789&0123456', result: false },
    ];
    testCase.forEach((item) => {
        const { projectId, result } = item;
        test(`region输入为(${projectId})，校验结果为${result}`, () => {
            expect(utils.checkProjectId(projectId)).toBe(result);
        });
    });
});

describe('test whether the region parameter is valid', () => {
    const testCase = [
        { region: 'cn-north-4', result: true },
        { region: '', result: false },
        { region: 'cnnorth-4', result: false },
        { region: 'cn-north4', result: false },
        { region: 'cn-north-4f', result: false },
        { region: 'cnccccccccc-north-4f', result: false },
        { region: 'dsdasa', result: false },
    ];
    testCase.forEach((item) => {
        const { region, result } = item;
        test(`region输入为(${region})，校验结果为${result}`, () => {
            expect(utils.checkRegion(region)).toBe(result);
        });
    });
});
