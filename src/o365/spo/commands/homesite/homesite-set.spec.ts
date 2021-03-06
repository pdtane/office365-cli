import commands from '../../commands';
import Command, { CommandValidate, CommandError, CommandOption } from '../../../../Command';
import * as sinon from 'sinon';
import auth, { Site } from '../../SpoAuth';
const command: Command = require('./homesite-set');
import * as assert from 'assert';
import request from '../../../../request';
import Utils from '../../../../Utils';
import appInsights from '../../../../appInsights';
import config from '../../../../config';

describe(commands.HOMESITE_SET, () => {
  let vorpal: Vorpal;
  let log: any[];
  let cmdInstance: any;
  let cmdInstanceLogSpy: sinon.SinonSpy;

  before(() => {
    sinon.stub(auth, 'restoreAuth').callsFake(() => Promise.resolve());
    sinon.stub(auth, 'ensureAccessToken').callsFake(() => { return Promise.resolve('ABC'); });
    sinon.stub(appInsights, 'trackEvent').callsFake(() => { });
    sinon.stub(command as any, 'getRequestDigest').callsFake(() => {
      return {
        FormDigestValue: 'ABC'
      };
    });
  });

  beforeEach(() => {
    vorpal = require('../../../../vorpal-init');
    log = [];
    cmdInstance = {
      log: (msg: string) => {
        log.push(msg);
      }
    };
    cmdInstanceLogSpy = sinon.spy(cmdInstance, 'log');
    auth.site = new Site();
  });

  afterEach(() => {
    Utils.restore([
      vorpal.find,
      request.post
    ]);
  });

  after(() => {
    Utils.restore([
      auth.ensureAccessToken,
      auth.restoreAuth,
      appInsights.trackEvent,
      (command as any).getRequestDigest
    ]);
  });

  it('has correct name', () => {
    assert.equal(command.name.startsWith(commands.HOMESITE_SET), true);
  });

  it('has a description', () => {
    assert.notEqual(command.description, null);
  });

  it('aborts when not logged in to a SharePoint tenant admin site', (done) => {
    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso.sharepoint.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: true }, url: 'https://contoso.sharepoint.com/sites/site1' }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError(`https://contoso.sharepoint.com is not a tenant admin site. Log in to your tenant admin site and try again`)));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('sets the specified site as the Home Site', (done) => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if (opts.body === `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="${config.applicationName}" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="57" ObjectPathId="56" /><Method Name="SetSPHSite" Id="58" ObjectPathId="56"><Parameters><Parameter Type="String">https://contoso.sharepoint.com/sites/Work</Parameter></Parameters></Method></Actions><ObjectPaths><Constructor Id="56" TypeId="{268004ae-ef6b-4e9b-8425-127220d84719}" /></ObjectPaths></Request>`) {
        return Promise.resolve(JSON.stringify(
          [
            {
              "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.8929.1227", "ErrorInfo": null, "TraceCorrelationId": "e4f2e59e-c0a9-0000-3dd0-1d8ef12cc742"
            }, 57, {
              "IsNull": false
            }, 58, "The Home site has been set to https:\u002f\u002fcontoso.sharepoint.com\u002fsites\u002fWork."
          ]
        ));
      }

      return Promise.reject('Invalid request');
    });

    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    auth.site.tenantId = 'abc';
    cmdInstance.action = command.action();
    cmdInstance.action({
      options: {
        siteUrl: "https://contoso.sharepoint.com/sites/Work"
      }
    }, (err?: any) => {
      try {
        assert(cmdInstanceLogSpy.calledWith('The Home site has been set to https://contoso.sharepoint.com/sites/Work.'));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('sets the specified site as the Home Site (debug)', (done) => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if (opts.body === `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="${config.applicationName}" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="57" ObjectPathId="56" /><Method Name="SetSPHSite" Id="58" ObjectPathId="56"><Parameters><Parameter Type="String">https://contoso.sharepoint.com/sites/Work</Parameter></Parameters></Method></Actions><ObjectPaths><Constructor Id="56" TypeId="{268004ae-ef6b-4e9b-8425-127220d84719}" /></ObjectPaths></Request>`) {
        return Promise.resolve(JSON.stringify(
          [
            {
              "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.8929.1227", "ErrorInfo": null, "TraceCorrelationId": "e4f2e59e-c0a9-0000-3dd0-1d8ef12cc742"
            }, 57, {
              "IsNull": false
            }, 58, "The Home site has been set to https:\u002f\u002fcontoso.sharepoint.com\u002fsites\u002fWork."
          ]
        ));
      }

      return Promise.reject('Invalid request');
    });

    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    auth.site.tenantId = 'abc';
    cmdInstance.action = command.action();
    cmdInstance.action({
      options: {
        debug: true,
        siteUrl: "https://contoso.sharepoint.com/sites/Work"
      }
    }, (err?: any) => {
      try {
        assert(cmdInstanceLogSpy.calledWith(vorpal.chalk.green('DONE')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('correctly handles error when setting the Home Site', (done) => {
    sinon.stub(request, 'post').callsFake((opts) => {
      if (opts.body === `<Request AddExpandoFieldTypeSuffix="true" SchemaVersion="15.0.0.0" LibraryVersion="16.0.0.0" ApplicationName="${config.applicationName}" xmlns="http://schemas.microsoft.com/sharepoint/clientquery/2009"><Actions><ObjectPath Id="57" ObjectPathId="56" /><Method Name="SetSPHSite" Id="58" ObjectPathId="56"><Parameters><Parameter Type="String">https://contoso.sharepoint.com/sites/Work</Parameter></Parameters></Method></Actions><ObjectPaths><Constructor Id="56" TypeId="{268004ae-ef6b-4e9b-8425-127220d84719}" /></ObjectPaths></Request>`) {
        return Promise.resolve(JSON.stringify(
          [
            {
              "SchemaVersion": "15.0.0.0", "LibraryVersion": "16.0.8929.1227", "ErrorInfo": {
                "ErrorMessage": "The provided site url can't be set as a Home site. Check aka.ms\u002fhomesites for cmdlet requirements.", "ErrorValue": null, "TraceCorrelationId": "f1f2e59e-3047-0000-3dd0-1f48be47bbc2", "ErrorCode": -2146232832, "ErrorTypeName": "Microsoft.SharePoint.SPException"
              }, "TraceCorrelationId": "f1f2e59e-3047-0000-3dd0-1f48be47bbc2"
            }
          ]
        ));
      }

      return Promise.reject('Invalid request');
    });

    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    auth.site.tenantId = 'abc';
    cmdInstance.action = command.action();
    cmdInstance.action({
      options: {
        siteUrl: "https://contoso.sharepoint.com/sites/Work"
      }
    }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError(`The provided site url can't be set as a Home site. Check aka.ms\u002fhomesites for cmdlet requirements.`)));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });

  it('fails validation if the siteUrl option not specified', () => {
    const actual = (command.validate() as CommandValidate)({ options: {} });
    assert.notEqual(actual, true);
  });

  it('fails validation if the siteUrl option is not a valid SharePoint site URL', () => {
    const actual = (command.validate() as CommandValidate)({ options: { siteUrl: 'foo' } });
    assert.notEqual(actual, true);
  });

  it('passes validation if the siteUrl option is a valid SharePoint site URL', () => {
    const actual = (command.validate() as CommandValidate)({ options: { siteUrl: 'https://contoso.sharepoint.com' } });
    assert.strictEqual(actual, true);
  });

  it('supports debug mode', () => {
    const options = (command.options() as CommandOption[]);
    let containsDebugOption = false;
    options.forEach(o => {
      if (o.option === '--debug') {
        containsDebugOption = true;
      }
    });
    assert(containsDebugOption);
  });

  it('has help referring to the right command', () => {
    const cmd: any = {
      log: (msg: string) => { },
      prompt: () => { },
      helpInformation: () => { }
    };
    const find = sinon.stub(vorpal, 'find').callsFake(() => cmd);
    cmd.help = command.help();
    cmd.help({}, () => { });
    assert(find.calledWith(commands.HOMESITE_SET));
  });

  it('has help with examples', () => {
    const _log: string[] = [];
    const cmd: any = {
      log: (msg: string) => {
        _log.push(msg);
      },
      prompt: () => { },
      helpInformation: () => { }
    };
    sinon.stub(vorpal, 'find').callsFake(() => cmd);
    cmd.help = command.help();
    cmd.help({}, () => { });
    let containsExamples: boolean = false;
    _log.forEach(l => {
      if (l && l.indexOf('Examples:') > -1) {
        containsExamples = true;
      }
    });
    Utils.restore(vorpal.find);
    assert(containsExamples);
  });

  it('correctly handles lack of valid access token', (done) => {
    Utils.restore(auth.ensureAccessToken);
    sinon.stub(auth, 'ensureAccessToken').callsFake(() => { return Promise.reject(new Error('Error getting access token')); });
    auth.site = new Site();
    auth.site.connected = true;
    auth.site.url = 'https://contoso-admin.sharepoint.com';
    cmdInstance.action = command.action();
    cmdInstance.action({ options: { debug: true }, siteUrl: 'https://contoso.sharepoint.com' }, (err?: any) => {
      try {
        assert.equal(JSON.stringify(err), JSON.stringify(new CommandError('Error getting access token')));
        done();
      }
      catch (e) {
        done(e);
      }
    });
  });
});