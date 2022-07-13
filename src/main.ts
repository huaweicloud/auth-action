import * as core from '@actions/core';
import * as utils from './utils';
import * as context from './context';

export async function run() {
    const inputs: context.Inputs = context.getInputs();

    // 如果参数输入有问题，终止操作
    if (!utils.checkInputs(inputs)) {
        core.setFailed('input parameters is not correct.');
        return;
    }
}

run().catch(core.setFailed);
