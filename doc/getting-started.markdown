# Getting Started

To deploy spartan, the first step is to install spartan server. It provides provisioner and attestation services. Once the server is setup, use our command-line interface to provision applications with the spartan server.

## Setting up spartan server

### Pre-requisites
* Node.js  
* Database - MySQL. Other dialects (Postgres, MariaDB or SQLite) are supported, but not tested.

### Installation

1. Start MySQL server 

2. Create a database for spartan service. This would look like:
```
mysql> create database spartan;
Query OK, 1 row affected (0.02 sec)
```
3. Create a user, password for spartan application that can read/write to this database

4. Install spartan server node application on your host.
```
$ npm install spartan-server
```
5. Generate an ECDSA keypair using openssl
```
$ openssl ecparam -name secp256r1 -genkey -out priv.key
$ openssl ec -in priv.key -pubout -out pub.key
```

6. Update your [config.js][] as needed. Specifically, host/ip, port, database credentials, 
ECDSA key paths, TLS cert and private key location.
It is highly recommended to use TLS certificates signed by a public CA.

7. Create/update the latest schema on the database

```
$ node syncdb.js
```

8. Spartan server provides a simple user management API. For testing you may create users using spartan user management APIs.

If you already have an existing identity management solution that supports OpenID Connect/JWT, spartan server can be easily configured to integrate with it.

(Optional) If you want to add any users to the system, you can do so by running an admin interface 
```
$ node bin/www-admin
```
and run the following curl comand to add user
```
$  curl -X POST -d 'userid=<userid>&userkey=<passwd>&createdBy=<admin@example.com>' localhost:2999/v1/user/create
```
This is assuming the spartan's user management API are running on localhost port 2999.

9. At this point you can start spartan server
```
node bin/www
```

## Installing and running the CLI

The CLI is written in Go. To install, just `go get` it
```
$ go get -u github.com/yahoo/spartan-go 
````
The commands and options currently supported by the CLI are listed in [spartan CLI documentation](https://github.com/yahoo/spartan-go/blob/master/README.md)


## Sample App, Role, UserGroup provisioning

Check out [sample-provision.sh](https://github.com/yahoo/spartan-go/blob/master/sample-provision.sh) which demonstrates commands to provision and associate app, usergroup and roles

[config.js]: ../src/config.js

## Testing using demo client and server

We have included a [demo](../demo) nodejs based client and server for testing. 

**Demo Server** To make the demo server work, copy the attestation server public key to demo/server and update the demo/server/config.js `asPubKey` with path info. 

Now start the server

```
$ node bin/www
```

**Demo Client** The client already has a test key pair included under keys directory, hence creating a new key pair for this demo client is optional.
```
$ cd demo/client
$ node auth-test.js
{ msg: 'app is authenticated!' }
```
