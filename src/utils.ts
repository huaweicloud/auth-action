import * as core from '@actions/core';
import * as context from './context';

// 正则校验表达式
const ACCESS_KEY_REG = new RegExp(/^[a-zA-Z0-9]{10,30}$/);
const SECRET_KEY_REG = new RegExp(/^[a-zA-Z0-9]{30,50}$/);

const PROJECT_ID_REG = new RegExp(/^[a-zA-Z0-9]{16,64}$/);

const REGION_REG = new RegExp(/^[a-zA-Z0-9]{1,5}-[a-zA-Z0-9]+-[1-9]$/);

/**
 * 检查每个inputs 属性value是否合法
 * @param inputs
 * @returns
 */
export function checkInputs(inputs: context.Inputs): boolean {
    if (!checkAkSk(inputs.accessKey, inputs.secretKey)) {
        core.info('ak or sk is not correct.');
        return false;
    }
    if (!checkProjectId(inputs.projectId)) {
        core.info('project id is not correct.');
        return false;
    }
    if (!checkRegion(inputs.region)) {
        core.info('region is not correct.');
        return false;
    }

    return true;
}

/**
 * 检查aksk是否合法
 * @param inputs
 * @returns
 */
export function checkAkSk(accessKey: string, secretKey: string): boolean {
    return ACCESS_KEY_REG.test(accessKey) && SECRET_KEY_REG.test(secretKey);
}

/**
 * 检查projectId是否合法
 * @param projectId
 * @returns
 */
export function checkProjectId(projectId: string): boolean {
    return projectId ? PROJECT_ID_REG.test(projectId) : true;
}

/**
 * 检查region格式是否合法
 * @returns
 */
export function checkRegion(region: string): boolean {
    return REGION_REG.test(region);
}

/**
 * 获取终端节点
 * @param region
 * @param endpointServiceName
 * @returns
 */
export function getEndpoint(region: string, endpointServiceName: string) {
    return 'https://' + endpointServiceName + '.' + region + '.myhuaweicloud.com';
}
