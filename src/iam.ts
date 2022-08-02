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
 * 查询区域判断用户凭证是否合法
 * @param
 * @returns
 */
export async function keystoneShowRegion(inputs: context.Inputs): Promise<boolean> {
    const client = getClientBuilder(inputs);
    const request = new iam.KeystoneShowRegionRequest();
    request.regionId = inputs.region;
    try {
        const result = await client.keystoneShowRegion(request);
        console.log(result);
        if (result.httpStatusCode !== 200) {
            core.setFailed('Keystone Show Region Request Error.');
            return false;
        }
    } catch (error) {
        core.setFailed('Keystone Show Region Failed.');
        return false;
    }

    return true;
}
