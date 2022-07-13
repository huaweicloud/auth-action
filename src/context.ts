import * as core from '@actions/core';

export interface Inputs {
    accessKey: string;
    secretKey: string;
    projectId: string;
    region: string;
}

export function getInputs(): Inputs {
    return {
        accessKey: core.getInput('access_key', { required: true }),
        secretKey: core.getInput('secret_key', { required: true }),
        projectId: core.getInput('project_id', { required: false }),
        region: core.getInput('region', { required: false }),
    };
}

export const CUSTOM_USER_AGENT = 'DevKit-GitHub:Authenticate to Huawei Cloud';
