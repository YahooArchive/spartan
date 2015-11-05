# spartan commandline utility 
spartan commandline utility can be used to interact with the provisioner service.
Options and commands currently supported are listed below.

```
$ spartan help
NAME
    spartan - commandline utility to interact with spartan

SYNOPSIS
    spartan [flags] command [params]

OPTIONS
   -u <userid>              userid to be used
   -s <url>                 base spartan URL to be used
   -c <cert bundle path>    CA crt bundle path, if not default
   -v                       verbose


STANDARD COMMANDS

 Usergroup commands

     show-usergroup <usergroup>
     create-usergroup <usergroup> [description ...]
     remove-usergroup <usergroup>
     add-to-usergroup <usergroup> <userid> [<usertype> <role>]
     remove-from-usergroup <usergroup> <usergroup>
     list-usergroups

 App group commands

     show-app <app>
     create-app <app> <usergroup> [description ...]
     remove-app <app>
     add-to-app <app> <identity file path> [<identityType> <role>]
     remove-from-app <identity>
     list-apps

 Role commands

     show-role <role>
     create-role <role> <usergroup> [<roleHandle> <roleType> [description ...]]
     remove-role <role>
     add-to-role <role> <app>
     remove-from-role <role> <app>
     list-roles

type 'spartan help' to see all available commands
type 'spartan help [command]' for usage of the specified command
```
