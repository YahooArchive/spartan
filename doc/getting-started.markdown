# Getting Started

From a deployment perspective, Spartan consists of two main components: 
* Provisioner and attestation service
* CLI for interacting with provisioner


## Setting up the provisioner and attestation service

### Pre-requisites
* Node.js  
* Database - Any one of the dialects (MySQL, Postgres, MariaDB or SQLite) supported by [sequelize](https://github.com/sequelize/sequelize) would work since we use sequelize API to interact with the database. Note that currently we've only tested Spartan with MySQL. 

### Steps
* Install and start your database server (one of those listed above). 

* Create a database for spartan service. With MySQL, this would look like:
```
mysql> create database spartan;
Query OK, 1 row affected (0.02 sec)
```
* Create a user, password  which can read/write to this database

* Install spartan server node application on your host.
```
$ npm install spartan-server
```
* Generate an ECDSA keypair using openssl
```
$ openssl ecparam -name secp256r1 -genkey -out priv.key
$ openssl ec -in priv.key -pubout -out pub.key
```
* Update your [config.js][] as needed. Specifically, host/ip, port, database credentials, 
ECDSA key paths, TLS cert and private key location.
It is highly recommended to use TLS certificates signed by a public CA.
Note that spartan server provides a simple user management API. 
If you already have an existing identity maangement solution, 
spartan server can be easily configured to integrate with it.

* Create/update the latest schema on the database
```
$ node syncdb.js
```

* At this point you can start spartan server
```
node bin/www
```

* (Optional) If you want to add any users to the system, you can do so by running a simple curl comand
```
$  curl -X POST -d 'userid=admin@example.com&userkey=ASBDFVEFVSERNMUHBSEFIHHDRVV&createdBy=admin@example.com' localhost:2999/v1/user/create
```
This is assuming the spartan's user management API are running on localhost port 2999.

## Installing and running the CLI

The CLI is written in Go. To install, just `go get` it
```
$ go get -u github.com/yahoo/go-spartan/... 
````
The commands and options currently supported by the CLI are listed in [spartan CLI documentation](https://github.com/yahoo/spartan-go/blob/master/README.md)


## Sample App, Role, UserGroup provisioning

Check out [sample-provision.sh](https://github.com/yahoo/spartan-go/blob/master/sample-provision.sh) which demonstrates commands to provision and associate app, usergroup and roles

[config.js]: ../src/config.js
