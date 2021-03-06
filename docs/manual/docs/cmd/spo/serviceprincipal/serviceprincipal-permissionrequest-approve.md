# spo serviceprincipal permissionrequest approve

Approves the specified permission request

## Usage

```sh
spo serviceprincipal permissionrequest approve [options]
```

## Alias

```sh
spo sp permissionrequest approve
```

## Options

Option|Description
------|-----------
`--help`|output usage information
`-i, --requestId <requestId>`|ID of the permission request to approve
`-o, --output [output]`|Output type. `json|text`. Default `text`
`--verbose`|Runs command with verbose logging
`--debug`|Runs command with debug logging

!!! important
    Before using this command, log in to a SharePoint Online tenant admin site, using the [spo login](../login.md) command.

## Remarks

To approve a permission request, you have to first log in to a tenant admin site using the [spo login](../login.md) command, eg. `spo login https://contoso-admin.sharepoint.com`

The permission request you want to approve is denoted using its `ID`. You can retrieve it using the [spo serviceprincipal permissionrequest list](./serviceprincipal-permissionrequest-list.md) command.

## Examples

Approve permission request with id _4dc4c043-25ee-40f2-81d3-b3bf63da7538_

```sh
spo serviceprincipal permissionrequest approve --requestId 4dc4c043-25ee-40f2-81d3-b3bf63da7538
```