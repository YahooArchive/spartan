
##Spartan JWT Types

Spartan heavily uses JSON Web Tokens (JWT) for authentication and authorization. It currently supports four types of tokens:

1. *User token*: represents a user. This token is issued by an identity provider and is compatible with OpenID Connect tokens
2. *AS app request token*: A self signed token from application requesting an authz token from Attestation Service (AS). 
3. *AS app response token*: A token issued by AS for authorization (in reponse to the previous request to AS)
4. *Service app request token*: A self signed token from client application, wrapping AS token inside, requesting a protected resource. For requests over HTTPS, directly sending authz token (with out self-signed wrapper token) is ok.

Spartan tokens are passed to the other end using a separate HTTP header - `x-spartan-auth-token`.  Since spartan tokens are platform agnostic, it can be used with any client-server protocol.

**NOTE**: This info is not required for operating Spartan. However if you wanted to write Spartan API bindings for an unsupported language, this would be useful.

---

**User token**

This is the decoded JWT struct. JWT are base64 encoded. User token is issued in exchange to a username and password. This is  mostly used for accessing provisioner server APIs. The recomended practice is to use your identity server to issue a JWT token with the format as below:

It is also possible to use OpenID Connect tokens as user token. Refer [Consuming a google user token](http://ncona.com/2015/02/consuming-a-google-id-token-from-a-server/) to learn about using identites from external providers.


```javascript
header: {
  alg: 'ES256',
  typ: 'JWT'
}

payload: {
  iat: 1446014735,  // issued at timestamp
  exp: 1446018335,  // token expiry timestamp
  ver: 1,
  type: 'user-token',
  sub: '<userid>',
  iss: '<user identity domain>' // default: spartan-domain if the user is in Users table
}

signature: { <JWT signature> }
```

---

**Application AS request token**

```javascript
header: {
  alg: 'ES256',
  typ: 'JWT'
}

payload: {
  iat: 1446014735,  // issued at timestamp
  exp: 1446018335,  // token expiry timestamp
  ver: 1,
  type: 'as-app-req',
  sub: '<app-public-key-sha256-fingerprint>',
  iss: 'self',
  pubkey: '<application public key in utf8 string>',
  role: '<requested service role>', 
  nonce: '<64-bit random number in hex>'
}

signature: { <JWT signature> }
```

---

**Attestation Service response token (astoken)**

```javascript
header: {
  alg: 'ES256',
  typ: 'JWT'
}

payload: {
  iat: 1446014735,  // issued at timestamp
  exp: 1446018335,  // token expiry timestamp
  ver: 1;
  type: 'as-app-token',
  sub: '<app-public-key-sha256-fingerprint>',
  iss : 'spartan-domain',
  role: '<service role>',
  ip: '<client/remote IP>'
}

signature: { <JWT signature> }
``` 

---

**Application's service request token**

```javascript
header: {
  alg: 'ES256',
  typ: 'JWT'
}

payload: {
  iat: 1446014735,  // issued at timestamp
  exp: 1446018335,  // token expiry timestamp
  ver: 1,
  type: 'app-svc-req',
  sub: '<app-public-key-sha256-fingerprint>',
  iss: 'self',
  pubkey: '<application public key in utf8 string>',
  astoken: '<JWT received from attestation server>',
  nonce: '<64-bit random number in hex>'
}

signature: { <JWT signature> }
```

**TODO**

Support user tokens for applications. The idea is to issue an AS authz token for a user in exchange of User Token.

