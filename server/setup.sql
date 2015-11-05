CREATE DATABASE spartan;
USE spartan;

CREATE TABLE user_db (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                          name VARCHAR(128) NOT NULL,
                          userid VARCHAR(128) NOT NULL,
                          type VARCHAR(32) NOT NULL,
                          key1 VARCHAR(4092) NOT NULL,
                          created_by VARCHAR(128) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          updated_by VARCHAR(128) NOT NULL,
                          updated_at TIMESTAMP NOT NULL,
                          role VARCHAR(32) NOT NULL
                          );
INSERT INTO user_db (name, userid, type, key1, created_by, updated_by, updated_at, role) VALUES('Binu Ram', 'rbinu@yahoo-inc.com', 'E', 'ASADFVEFVSERNMUHBSEFIHHDRVV', 'rbinu@yahoo-inc.com', 'rbinu@yahoo-inc.com', NOW(), 'ADMIN');
 
CREATE TABLE user_group (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                          name VARCHAR(128) NOT NULL UNIQUE,
                          created_by VARCHAR(128) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          updated_by VARCHAR(128) NOT NULL,
                          updated_at TIMESTAMP NOT NULL,
                          description VARCHAR(512)
                          );
  
INSERT INTO user_group (name, created_by, updated_by, updated_at, description) VALUES('usergroup1', 'rbinu@yahoo-inc.com', 'rbinu@yahoo-inc.com', NOW(), 'test usergroup1'); 
INSERT INTO user_group (name, created_by, updated_by, updated_at, description) VALUES('usergroup2', 'dev@yahoo.com', 'dev@yahoo.com', NOW(), 'test usergroup2');
  
CREATE TABLE users (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                          userid VARCHAR(128) NOT NULL,
                          user_group_name VARCHAR(128) NOT NULL,
                          user_type VARCHAR(32) NOT NULL,
                          created_by VARCHAR(128) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          role VARCHAR(32) NOT NULL
                          );
 
INSERT INTO users (userid, user_group_name, user_type, created_by, role) VALUES('rbinu@yahoo-inc.com', 'usergroup1', 'E', 'rbinu', 'ADMIN');
INSERT INTO users (userid, user_group_name, user_type, created_by, role) VALUES('dev@yahoo.com', 'usergroup2', 'E', 'dev@yahoo.com', 'ADMIN');
INSERT INTO users (userid, user_group_name, user_type, created_by, role) VALUES('piya@yahoo.com', 'usergroup1', 'E', 'rbinu@yahoo-inc.com', 'MEMBER');
INSERT INTO users (userid, user_group_name, user_type, created_by, role) VALUES('prbinu@yahoo.com', 'usergroup1', 'H', 'rbinu@yahoo-inc.com', 'ADMIN');

CREATE TABLE app_group (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                          name VARCHAR(128) NOT NULL UNIQUE,
                          created_by VARCHAR(128) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          updated_by VARCHAR(128) NOT NULL,
                          updated_at TIMESTAMP NOT NULL,
                          owned_by VARCHAR(128) NOT NULL,
                          description VARCHAR(512)
                          );
  
INSERT INTO app_group (name, created_by, updated_by, updated_at, owned_by, description) VALUES('app1', 'rbinu@yahoo-inc.com', 'rbinu@yahoo-inc.com', NOW(), 'usergroup1', 'app1 test'); 

INSERT INTO app_group (name, created_by, updated_by, updated_at, owned_by, description) VALUES('app2', 'dev@yahoo.com', 'dev@yahoo-inc.com', NOW(), 'usergroup2', 'app2 test'); 
  
CREATE TABLE app_members (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                          identity VARCHAR(4092) NOT NULL,
                          identity_type VARCHAR(4092) NOT NULL,
                          app_name VARCHAR(128) NOT NULL,
                          created_by VARCHAR(128) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          role VARCHAR(32) NOT NULL
                          );

INSERT INTO app_members (identity, identity_type, app_name, created_by, role) VALUES('SDTGHHGHHJFFAWFSDVFGR', 'SHA256-Fingerprint', 'app1', 'rbinu@yahoo-inc.com', 'DEFAULT');

INSERT INTO app_members (identity, identity_type, app_name, created_by, role) VALUES('GDHFDNWEDFGHHGHHJFFAW', 'SHA256-Fingerprint', 'app2', 'dev@yahoo.com', 'DEFAULT');

CREATE TABLE roles (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                          name VARCHAR(128) NOT NULL UNIQUE,
                          role_type VARCHAR(128) NOT NULL,
                          role_handle VARCHAR(128),
                          created_by VARCHAR(128) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          updated_by VARCHAR(128) NOT NULL,
                          updated_at TIMESTAMP NOT NULL,
                          owned_by VARCHAR(128) NOT NULL,
                          description VARCHAR(512)
                          );

INSERT INTO roles (name, role_type, role_handle, created_by, updated_by, updated_at, owned_by, description) VALUES('role1', 'SERVICE', 'ykeykey.yahoo.com:443', 'rbinu@yahoo-inc.com', 'rbinu@yahoo-inc.com', NOW(), 'usergroup1', 'test service group1'); 

INSERT INTO roles (name, role_type, role_handle, created_by, updated_by, updated_at, owned_by, description) VALUES('role2', 'SERVICE', 'sherpa.yahoo.com:443', 'dev@yahoo.com', 'dev@yahoo.com', NOW(), 'usergroup2', 'test service group2'); 

CREATE TABLE role_members (id INT NOT NULL AUTO_INCREMENT PRIMARY KEY, 
                          app_name VARCHAR(128) NOT NULL,
                          role_name VARCHAR(128) NOT NULL,
                          created_by VARCHAR(128) NOT NULL,
                          created_at TIMESTAMP NOT NULL DEFAULT NOW(),
                          role VARCHAR(32) NOT NULL
                          );

INSERT INTO role_members (app_name, role_name, created_by, role) VALUES('app1', 'role1', 'rbinu@yahoo-inc.com', 'ADMIN');
INSERT INTO role_members (app_name, role_name, created_by, role) VALUES('app2', 'role2', 'dev@yahoo.com', 'ADMIN');

