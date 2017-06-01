# Security
[note: This repo is WIP and may not have all secuirty features implemented]

Spartan IS a security infrastructure. The system is designed to protect against various attacks such as Man-in-the-Middle (MITM), token tampering/spoofing attacks

The threat landscape for a system like spartan is pretty large. We consciously opt not to solve all peripheral security problems, instead focused on security of tokens and token exchange protocols that are core to our system. For example, though the expectation is to store app private key securely, we don't control the way you store and distribute. Our APIs do not accept key file paths, instead it accepts the keys loaded in memory. In that way you can distribute and store the keys securely in a way specific to your environment.

### What is not in scope?

* Users who use spartan for their applications - by creating mappings between apps and roles. A user compromise can affect apps and role that person’s usergroup owns 

* Spartan admins: Spartan admins are the super users with complete control over spartan system. If an admin account is compromised, then its game over.

* Client or server applications: If the client is compromised, it may impersonate the client to server

User and admin compromise is a generic problem. There are different ways to mitigate those risks, such as enabling second factor authentication, using short lived credentials, etc. 

The client or a server host compromise is also a generic problem. It often occurs when an application has security vulnerabilities. The impact of an exploit also varies. The mitigation is to follow best security practices and above all follow good security hygiene when developing and deploying applications, and managing hosts.

### What is in scope?
The main feature of spartan is to protect a resource (e.g. a service endpoint) from unauthorized access. The threat model is to enumerate all attacks and build defenses against those attacks.

*So how an attacker can gain access to a spartan protected service endpoint?*

1. MITM and replay attacks
2. Gain access to provisioner or attestation service or steal AS private key
3. Weakness in crypto used in spartan
4. Compromise a user who has admin access to apps and roles. In that way attacker can add his app identity to an app to gain access to resource.
5. Compromise client hosts - the attacker can impersonate the client and gain access to protected service

Spartan does not have direct protection against (4) and (5). Instead to mitigate the risk, user/admins must follow security best practices to protect their credentials and the applications/host that they manage.

**MITM/replay attack**
This is one of the main focus of our threat model. Given that the adversary is able to capture the request and replay it, how can we protect against such attacks

* The recommended solution is to use TLS for transport security. This will provide protection against active eavesdropping attacks.
* If the network communication is not protected (e.g. HTTP),  spartan provides protection by: 
  * Auth tokens are signed with client’s private key and are not reused (use nonce and short expiry). The server will cache nonce untill its expiry
  * Sign the request body with client’s private key so that the adversary cannot modify the request in transit

**AS private key**
Protection of attestation service private key(s) is paramount to the security of the whole system. This is mostly a deployment problem. We will provide guidelines to protect AS private key soon.


**Crypto weaknesses**
Spartan is using modern crypto technologies such as JWT and ECDSA algorithms. The system is dependent of open source crypto libraries. If these libraries contain security vulnerabilities, then that could be one risk.

The nonce are generated using crypto random number generator functions and tokens are basically json web tokens (JWT)

## Identity
An application instance is represented using its public key fingerprint (SHA256), The identity of the application instance is based on its private key, that means the knowledge of a private key is considered as a proof of identity. It is possible to impersonate a client if an intruder steals the private key from the application host.

**Mitigation**

1. Generate key pairs inside container or VM, and the private key should not leave the host.
2. Key should not be repurposed or shared. In the world of dynamic provisioning, keys never persist for long period.
3. Soft check based on connecting client IP to see if the same keys are used elsewhere. The client IP is also attached to the AS token. This is not a strong assertion, but it can flag some potential issues. 

## Trust
A self-signed token by itself is not trusted or has no meaning. The trust is derived when it mapped to a spartan app or a role in the provisioner server. The app or the role's trust is derived from the user (user group) who owns it. 

AS token issued by attestation service binds application identity with its public key (fingerprint). The identity of the application is established from its app or role membership.

### Authorization
**Client -> Attestation service**

The authorization is provided by AStoken issued by attestation service. AS upon receving request from clients, authenticates the request by verifying client's self-signed token received as part of the request. It then extracts the subject ('sub') field (contains SHA256 public key fp) in the token and try to match with all mapped roles. If found, AS issues a token that asserts that the application is a member of requested role. Client can use this token to access a service protected by that role. The AStoken is scoped to a role, hence this token cannot to use to access other services/resources

**Client -> Server**

The client application self signs the AStoken and pass it as part of the request to access a protected service. The server application recevies the request, validate AStoken with AS public key. It also validates the client signature using the public key embedded in the request token. The server then computes a SHA256 of the client's public key embedded in the token and compare it with the SHA256 fingerprint embedded in the AS token (JWT 'sub' field). The client signature is trusted only if the fingerprints are same. Server also make sure the application is part of the server role before granting access. To thwart replay attacks, tokens are not reused and the token nonce is stored in the server side untill the token's expiry 

AStokens can be directly passed (with out client's signature) if the communication channel is secured (HTTPS). This will avoid the need to use new token for every request.
