import * as core from '@actions/core';
import * as context from './context';
/**
 * 华为云凭证设置为加密的环境变量
 * @param inputs
 */
export async function exportCredentials(inputs: context.Inputs) {
    core.setSecret(inputs.accessKey);
    core.exportVariable('HUAWEI_CLOUD_ACCESS_KEY', inputs.accessKey);

    core.setSecret(inputs.secretKey);
    core.exportVariable('HUAWEI_CLOUD_SECRET_KEY', inputs.secretKey);

    core.setSecret(inputs.region);
    core.exportVariable('HUAWEI_CLOUD_REGION', inputs.region);

    if (inputs.projectId) {
        core.setSecret(inputs.projectId);
        core.exportVariable('HUAWEI_CLOUD_PROJECT_ID', inputs.projectId);
    }
    core.info('Huawei Cloud Credentials environment variables have been set');
}
