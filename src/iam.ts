import * as context from './context';
import * as utils from './utils';
import * as core from '@actions/core';
import * as huaweicore from '@huaweicloud/huaweicloud-sdk-core';
import * as iam from '@huaweicloud/huaweicloud-sdk-iam';

export function getClientBuilder(inputs: context.Inputs): iam.IamClient {
    const credentials = new huaweicore.BasicCredentials()
        .withAk(inputs.accessKey)
        .withSk(inputs.secretKey);
    let credentialsWithProject = credentials;
    if (inputs.projectId) {
        credentialsWithProject = credentials.withProjectId(inputs.projectId);
    }
    const client = iam.IamClient.newBuilder()
        .withCredential(credentialsWithProject)
        .withEndpoint(utils.getEndpoint(inputs.region, context.ENDPOINT_SERVICE_NAME))
        .withOptions({ customUserAgent: context.CUSTOM_USER_AGENT })
        .build();
    return client;
}

/**
 * 查询指定永久访问密钥是否存在
 * @param
 * @returns
 */
export async function showPermanentAccessKey(inputs: context.Inputs): Promise<boolean> {
    const client = getClientBuilder(inputs);
    const request = new iam.ShowPermanentAccessKeyRequest();
    request.accessKey = inputs.accessKey;
    const result = await client.showPermanentAccessKey(request);
    console.log(result);
    if (result.httpStatusCode !== 200) {
        core.setFailed('Show Permanent Access Key Failed.');
        return false;
    }
    return true;
}

/**
 * 查询项目是否正常
 * @param
 * @returns
 */
export async function keystoneShowProject(inputs: context.Inputs): Promise<boolean> {
    if (!inputs.projectId) {
        return true;
    }
    const client = getClientBuilder(inputs);
    const result = await client.keystoneShowProject();
    console.log(result);
    if (result.httpStatusCode !== 200) {
        core.setFailed('Keystone Show Project Failed.');
        return false;
    }

    return true;
}
