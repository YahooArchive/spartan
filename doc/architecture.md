# Spartan Architecture


### End to end flow

<img src="./highlevel-flow.png">

Spartan consists 3 components:

1. A server component that is comprised of two services: 

* *Provisioner service*
* *Attestation service*

2. Command line tool - Used by a user to provision applications with provisioner service
3. Client library. Provides language based APIs to your applications. Currently we have NodeJS and Go language bindings for spartan. The client APIs are used by client and server to fetch and validate AS tokens
 
**Provsioner service**
The provisioner service provides REST APIs for the user to provision user groups, application groups, roles and group membership

The following entities (database tables) are part of provisioner service:

* *User Group* - A group of users. Each user has a role (e.g. Admin).
* *Apps* - Your application is represented as `Apps`. If your application has more than one instances (more servers), you may group it as one entity using Apps. 
* *Roles* - Represents a privilege to access a resource. If your app wanted to access a role protected resource, then add the apps as a member to that role 
* *Users* - User database. If you already have an identity system that issues a JWT/OpenID Connect token, then you may not need this

Interface to these APIs are through the `spartan` command line tool. 

**Attestation service**
The attestation service provides APIs that issues certificate tokens after verifying relationship between application and role 
