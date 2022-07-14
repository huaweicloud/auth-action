import * as core from '@actions/core';

export interface Inputs {
    accessKey: string;
    secretKey: string;
    region: string;
    projectId: string;
}

export function getInputs(): Inputs {
    return {
        accessKey: core.getInput('access_key_id', { required: true }),
        secretKey: core.getInput('secret_access_key', { required: true }),
        region: core.getInput('region', { required: true }),
        projectId: core.getInput('project_id', { required: false }),
    };
}

export const CUSTOM_USER_AGENT = 'DevKit-GitHub:Authenticate to Huawei Cloud';
