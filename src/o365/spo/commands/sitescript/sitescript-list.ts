import auth from '../../SpoAuth';
import config from '../../../../config';
import request from '../../../../request';
import commands from '../../commands';
import SpoCommand from '../../SpoCommand';
import { ContextInfo } from '../../spo';

const vorpal: Vorpal = require('../../../../vorpal-init');

class SpoSiteScriptListCommand extends SpoCommand {
  public get name(): string {
    return `${commands.SITESCRIPT_LIST}`;
  }

  public get description(): string {
    return 'Lists site script available for use with site designs';
  }

  public commandAction(cmd: CommandInstance, args: {}, cb: () => void): void {
    auth
      .ensureAccessToken(auth.service.resource, cmd, this.debug)
      .then((accessToken: string): Promise<ContextInfo> => {
        if (this.debug) {
          cmd.log(`Retrieved access token ${accessToken}. Retrieving request digest...`);
        }

        if (this.verbose) {
          cmd.log(`Retrieving request digest...`);
        }

        return this.getRequestDigest(cmd, this.debug);
      })
      .then((res: ContextInfo): Promise<{ value: any[] }> => {
        const requestOptions: any = {
          url: `${auth.site.url}/_api/Microsoft.Sharepoint.Utilities.WebTemplateExtensions.SiteScriptUtility.GetSiteScripts'`,
          headers: {
            authorization: `Bearer ${auth.service.accessToken}`,
            'X-RequestDigest': res.FormDigestValue,
            accept: 'application/json;odata=nometadata'
          },
          json: true
        };

        return request.post(requestOptions);
      })
      .then((res: { value: any[] }): void => {
        if (res.value && res.value.length > 0) {
          cmd.log(res.value);
        }

        if (this.verbose) {
          cmd.log(vorpal.chalk.green('DONE'));
        }

        cb();
      }, (err: any): void => this.handleRejectedODataJsonPromise(err, cmd, cb));
  }

  public commandHelp(args: {}, log: (help: string) => void): void {
    const chalk = vorpal.chalk;
    log(vorpal.find(this.name).helpInformation());
    log(
      `  ${chalk.yellow('Important:')} before using this command, log in to a SharePoint Online site using the
      ${chalk.blue(commands.LOGIN)} command.
        
  Remarks:

    To list available site scripts, you have to first log in to a SharePoint site using the
    ${chalk.blue(commands.LOGIN)} command, eg. ${chalk.grey(`${config.delimiter} ${commands.LOGIN} https://contoso.sharepoint.com`)}.

  Examples:
  
    List all site scripts available for use with site designs
      ${chalk.grey(config.delimiter)} ${this.name}

  More information:

    SharePoint site design and site script overview
      https://docs.microsoft.com/en-us/sharepoint/dev/declarative-customization/site-design-overview
`);
  }
}

module.exports = new SpoSiteScriptListCommand();