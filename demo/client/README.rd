# Test client application

Create app key pairs:

To generate ecdsa keypair using openssl, run the following commands:
```
% openssl ecparam -name secp384r1 -genkey -out test-priv.key
% openssl ec -in test-priv.key -pubout -out test-pub.key
```

Run:

```
% nodejs index.js
```

