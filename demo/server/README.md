# Spartan Demo App Server

# Test setup

1. clone the repo
2. cd server && npm install
3. Run the demo server. (Make sure you are already running spartan 
   Attestation Service. Find README.md on the main page for install instructions)
```
$ node bin/www
```
4. To test: cd ../client & nodejs index.js
```
$ cd ../client & nodejs index.js
```

NOTE:
Make sure the Spartan server's public key is included in spartan APIs npm package.
Clue: as_pubkey
