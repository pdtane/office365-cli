# spo listitem isrecord

Checks if the specified list item is a record

## Usage

```sh
spo listitem isrecord [options]
```

## Options

Option|Description
------|-----------
`--help`|output usage information
`-u, --webUrl <webUrl>`|The URL of the site where the list is located
`-i, --id <id>`|The ID of the list item to check if it is a record
`-l, --listId [listId]`|The ID of the list where the item is located. Specify `listId` or `listTitle` but not both
`-t, --listTitle [listTitle]`|The title of the list where the item is located. Specify `listId` or `listTitle` but not both
`--verbose`|Runs command with verbose logging
`--debug`| Runs command with debug logging

!!! important
    Before using this command, log in to a SharePoint Online site, using the [spo login](../login.md) command.

## Remarks

To check whether an item is a record, you have to first log in to a SharePoint site using the [spo login](../login.md) command, eg. `spo login https://contoso.sharepoint.com`.

## Examples

Check whether the document with id _1_ in list with title _Documents_ located in site _https://contoso.sharepoint.com/sites/project-x_ is a record

```sh
spo listitem isrecord --webUrl https://contoso.sharepoint.com/sites/project-x --listTitle 'Documents' --id 1
```

Check whether the document with id _1_ in list with id _0cd891ef-afce-4e55-b836-fce03286cccf_ located in site _https://contoso.sharepoint.com/sites/project-x_ is a record

```sh
spo listitem isrecord --webUrl https://contoso.sharepoint.com/sites/project-x --listId 0cd891ef-afce-4e55-b836-fce03286cccf --id 1
```
