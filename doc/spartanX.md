# SpartanX - X.509 Certificate-based Authorization Architecture
(Originally conceived in Dec-2015)

## A Reference Architecture for:
 1. Bootstrapping application/service identity (See detailed description here: [identity-bootstrapping.md](https://github.com/yahoo/spartan/blob/master/doc/identity-bootstrapping.md))
 2. Short-lived TLS X509 Certificates
 2. X509 Certificate based service authorization

## Introduction

Container technologies are revolutionizing the way we develop, build and deploy applications
in large scale production environments. At Yahoo we use containers in our CI build farms and production
environments, that are on-demand and dynamic in nature. Applications running in containers often need to
connect to various internal/external services that require authentication and authorization. Authenticating
client application to a server is a challenge in such dynamic environments because we cannot rely on traditional
IP or hostname based checks. IP based authentication no longer works because (1) container IP is dynamic and often
repurposed (2) containers often share IPs. Alternate options include the use of TLS client certificates and other 
key based authentication schemes. TLS client certificates provide authentication, but not authorization
capabilities by its own.

SpartanX is an extension to Spartan that issues short lived X.509 certificate and support role based authorization. 
This small but significant enhancement enable spartan to support both token (JWT) and X.509 certificate client 
authorization. The design philosophy is try not to over-engineering things, instead focus on simple
(easy to understand, verify, integrate and use), but effective/scalable solutions.

## What is SpartanX ?
When compared with existing spartan system, the architecture remains same (Spartan is a role based authz system),
but spartanX adds an additional endpoint to spartan Attestation Service (AS) that issues X.509 certificates to applications.

The new proposal to use a single X509 certificate for both authentication and authorization. It works without any
custom extensions, libraries or configuration!

In general X.509 certificates are meant for identities and are used for authentication. An X.509 certificate
basically binds identity with a public key. In our model, we use X.509 certificate that binds role(s) with a
public key. The role provides both authentication and authorization for client X.509 certificates

<img src="https://github.com/yahoo/spartan/blob/master/doc/spartanX.png?raw=true">

## High-level Flow
* The flow is similar to existing spartan system. Steps (1) (2) and (3) are part of system provisioning/deployment (control plane). 
(4) (5) and (6) is the application runtime (data plane) 
* The user (or headless user) provisions the container (application), generate a public, private key pair and a self-signed certificate
inside the application container.
* The fingerprint of the public key is computed and is added to respective role in the provisioner service 
(think Provisioner Service as a mapping application that binds an application with a set of public key or its fingerprint)
* In client side, use curl (or similar tools/libs) with self-signed client certificates and  connect to attestation server (AS) server.
AS then extracts public key from the client TLS certificate, compute the fingerprint and does a lookup for role membership. 
If found, AS server issues a short expiry (<24 hours) X.509 certificate with Subject DNAME set to appropriate **role**. 
For example, if App1 client wants to connect `x.s3.aws.com` instance, the Subject DNAME of the cert issued contains 
CNAME called: ```app1.roles.x.s3.aws.com.``` (other combinations/refinements on DNAMES, SANs are possible)

Example curl call to Attestation Service:

 ```curl --cert ./app-cert.pem --key ./app-privkey.pem https://as.example.com/api/as/getx509certs?role=x.s3.aws.com```

In the server side, enable TLS client auth and set TLS client Subject CNAME to match ```app1.roles.x.s3.aws.com```. 
For example, In apache mode_ssl case, use SSL_CLIENT_S_DN_CN.Similar capabilities are available on all major servers
The concept of roles can also extended to have more granular roles like ```admin.roles.x.s3.aws.com.``` 
and ```super-admin.roles.x.s3.aws.com.``` etc.

The AS basically acts as root or an intermediate CA. That means the application server needs to trust AS public key. If the AS public
key is cross-signed by a third party root CA (DigiCert, Verisign etc.) with proper name constraints, then even AS public key distribution
is not required. If cross-signing is not an option, we can sign AS public key with an internal root CA
and distribute root CA to all hosts. The advantage is that AS public key becomes an intermediate CA, and we
keep the root CA offline - which is more secure and also enable periodic key rolling capabilities.

## Features/Advantages

* The ability to issue short-lived TLS certificates. Private key by itself has no meaning, unless we bind it with a role
* No key management hassles - No keys are stored elsewhere, copied or distributed. Keys are generated on the fly in 
the containers as part of application provisioning/deployment phase
* The short lived certificates can also extend to server certificate as well; for instance Edge/Mini pods use case. if the AS root
cert is cross-signed with an external trusted CA, the potential is huge
* No token replay attack possible, because the auth is tied with TLS session
* Better performance: Expensive crypto validation happens during the TLS handshake itself, hence no need to do it for every HTTP requests
 (part of same TLS session). In addition, we can also leverage TLS session reuse
* Can even work with no custom software/library for both server and client side. The only requirement is standard TLS support. 
You can pull your certificate just by using a curl cmd-line tool
* Scalable role based solution
* Easily enable client auth for any application that supports TLS. Eg. MySQL access from Kubernetes cluster. Note that IP 
whitelist is not a reliable solution in dynamic environments
* SpartanX can issue both X.509 certificate and JWT based app token, thereby covering different use-case scenarios

## Limitations

* Since delegation through delegation is not possible one side effect with this is - in many cases, we need to pass the auth tokens
to downstream servers. Without some kind of chaining support, it is hard to delegate/pass the token credentials. This is one 
reason we still need to support the current token based system - something easy to pass to other servers.

* TLS pre-requisite. This solution works only with TLS, and in many cases, the communication is not over TLS (or not feasible 
to use TLS).

## Short-lived Certificates for Servers

The above diagram was modeled for client auth. This concept is equally applicable for servers getting short lived service certificates.
In that model, server makes calls to AS server and refresh the certificate based on role membership.

## Variations 
With the ability to deploy our application continuously and fast with CI/CD, instead of pulling/refreshing
the certificates dynamically, it is much less hassle if we provision (step 2 in the diagram) certificates during the application deployment phase.
Since the lifespan of these containers are short, no run-time refresh is necessary. We expect
(and want to) to see more such run-time resource loading  (eg. provisioning of secrets) move to deployment phase. This drastically reduces
many run-time external dependencies - means app developers and SEs have fewer things to worry about. If we are following this mode,
then instead of provisioning a self-signed cert (step 2), we drop a CA signed cert into application container, and these certificates are
never reused. If the cert gets expired, then the app must be re-deployed with the new certificates. In general we should shift run-time
dependencies to deploy-time dependencies if possible.

## User Identity

SpartanX can issue X.509 certificate for users, that represent identity and the privilege. For user, we may either use Subject
UID field that identifies the user or overload Subject CNAME with some special naming convention. User based certificates is an
alternate solution to Kerberos in Grid and similar environments.

## Security Considerations

The technologies (TLS, X.509 etc) we use are widely in use for many years. Our contribution is to make these technologies available
to operate at scale to meet our security requirements. All standard security practices must be followed for deployment.

Architecture/Design threat modeling  (An exercise for security engineers, and we highly appreciate those efforts :-) )

## References
* http://www.ietf.org/rfc/rfc3820.txt
* https://tools.ietf.org/html/rfc5755
* http://italiangrid.github.io/voms/
