import * as main from '../src/main';

import * as utils from '../src/utils';
import * as context from '../src/context';
import * as iam from '../src/iam';
import * as credential from '../src/credential';
import * as core from '@actions/core';

jest.mock('../src/context');
jest.mock('../src/credential');
jest.mock('@actions/core');

describe('mock main', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('mock checkInputs, showPermanentAccessKey and keystoneShowProject return true', async () => {
        jest.spyOn(utils, 'checkInputs').mockReturnValue(true);
        jest.spyOn(iam, 'showPermanentAccessKey').mockReturnValue(Promise.resolve(true));
        jest.spyOn(iam, 'keystoneShowProject').mockReturnValue(Promise.resolve(true));

        await main.run();

        expect(context.getInputs).toHaveBeenCalledTimes(1);

        expect(utils.checkInputs).toHaveBeenCalledTimes(1);

        expect(iam.showPermanentAccessKey).toHaveBeenCalledTimes(1);

        expect(iam.keystoneShowProject).toHaveBeenCalledTimes(1);

        expect(credential.exportCredentials).toHaveBeenCalledTimes(1);
    });

    test('mock checkInputs, showPermanentAccessKey return true and keystoneShowProject return false', async () => {
        jest.spyOn(utils, 'checkInputs').mockReturnValue(true);
        jest.spyOn(iam, 'showPermanentAccessKey').mockReturnValue(Promise.resolve(true));
        jest.spyOn(iam, 'keystoneShowProject').mockReturnValue(Promise.resolve(false));

        await main.run();

        expect(context.getInputs).toHaveBeenCalledTimes(1);

        expect(utils.checkInputs).toHaveBeenCalledTimes(1);

        expect(iam.showPermanentAccessKey).toHaveBeenCalledTimes(1);

        expect(iam.keystoneShowProject).toHaveBeenCalledTimes(1);
        expect(core.setFailed).toHaveBeenNthCalledWith(1, 'project_id is not found.');

        expect(credential.exportCredentials).not.toHaveBeenCalled();
    });

    test('mock checkInputs return true and showPermanentAccessKey return false', async () => {
        jest.spyOn(utils, 'checkInputs').mockReturnValue(true);
        jest.spyOn(iam, 'showPermanentAccessKey').mockReturnValue(Promise.resolve(false));
        jest.spyOn(iam, 'keystoneShowProject').mockReturnValue(Promise.resolve(true));
        await main.run();

        expect(context.getInputs).toHaveBeenCalledTimes(1);

        expect(utils.checkInputs).toHaveBeenCalledTimes(1);

        expect(iam.showPermanentAccessKey).toHaveBeenCalledTimes(1);
        expect(core.setFailed).toHaveBeenNthCalledWith(1, 'AK/SK is not found.');

        expect(iam.keystoneShowProject).not.toHaveBeenCalled();

        expect(credential.exportCredentials).not.toHaveBeenCalled();
    });

    test('mock checkInputs return false', async () => {
        jest.spyOn(utils, 'checkInputs').mockReturnValue(false);
        jest.spyOn(iam, 'showPermanentAccessKey').mockReturnValue(Promise.resolve(false));
        jest.spyOn(iam, 'keystoneShowProject').mockReturnValue(Promise.resolve(true));
        await main.run();

        expect(context.getInputs).toHaveBeenCalledTimes(1);

        expect(utils.checkInputs).toHaveBeenCalledTimes(1);
        expect(core.setFailed).toHaveBeenNthCalledWith(1, 'input parameters is not correct.');

        expect(iam.showPermanentAccessKey).not.toHaveBeenCalled();

        expect(iam.keystoneShowProject).not.toHaveBeenCalled();

        expect(credential.exportCredentials).not.toHaveBeenCalled();
    });
});
