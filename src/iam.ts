import * as core from '@actions/core';
import * as context from './context';

import * as huaweicore from '@huaweicloud/huaweicloud-sdk-core';
import * as iam from '@huaweicloud/huaweicloud-sdk-iam';


/**
 * 查询指定永久访问密钥是否存在
 * @param
 * @returns
 */
 export async function showPermanentAccessKey(inputs: context.Inputs): Promise<boolean> {
    const credentials = new huaweicore.GlobalCredentials()
                     .withAk(inputs.accessKey)
                     .withSk(inputs.secretKey)
    const client = iam.IamClient.newBuilder()
                                .withCredential(credentials)
                                .withEndpoint(`https://iam.${inputs.region}.myhuaweicloud.com`)
                                .withOptions({customUserAgent: context.CUSTOM_USER_AGENT})
                                .build();
    const request = new iam.ShowPermanentAccessKeyRequest();
    request.accessKey = inputs.accessKey;
    const result = await client.showPermanentAccessKey(request);
    if (result.httpStatusCode != 200) {
        core.setFailed('Show Permanent Access Key Failed.');
        return false;
    }
    return true;
}
