## Bootstrapping Service Identity in Platform as a Service (PaaS) Environments

This document presents a secure architecture to bootstrap service identities in PaaS environments 
(eg. Kubernetes or Applications running on AWS). The model is abstracted
out to make it generic as possible, and the following sequence diagram depicts the overall flow of the model. 

<img src="https://cdn.rawgit.com/yahoo/spartan/master/doc/identity-bootstrapping.svg">

The above flow diagram is modeled based on OAuth2 flow. From an OAuth2 view, SpartanX is the identity provider, 
Tenant is the resource owner, and the Orchestrator (provider) is the 3rd party who deploys applications (resources) 
behalf of the tenant. 

In this model, we need a SpartanX service with a set of APIs exposed. These APIs are invoked by:

1. Tenant - to register and provision their applications
2. Orchestrator master node - to Add and Remove application identities
3. Worker node - supports application instances running on the node to fetch and refresh service identities and certificates. 
A worker node is a node under Orchestrator's domain on which application instances are launched. 

The Worker node is authenticated to SpartanX using Mutual TLS (mTLS). The master node during deployment binds application’s 
public key fingerprint with worker node’s identity and register it with SpartanX using `AddToTenantApp` API. Each application 
instance running on a worker node will have a process (sidecar proxy) responsible for refreshing the certificates for that
application instance. The sidecar proxy at regular intervals connects to SpartanX through Node agent (not shown in the diagram). 
The Node agent forwards the sidecar proxy request to SpartanX and authenticates using mTLS.

Note that Orchestrator is a trusted system, not a security system. As a good security practice, we should not overload Orchestrator
to make it a trust anchor, instead security of the application deployed should be separated out from the Orchestrator. In this context,
separation means the separation of the control. Decoupling is a desired property here.

### Implementation
To implement this model, Orchestrator needs to expose hooks at various phases of application deploy lifecycle. Orchestrator is required 
to call the following APIs:

`AuthorizeTenentAppAccess(tenant_atoken, provider_token, app_id)`

The above API authorizes the Orchestrator (provider) to add and remove service identities to the given app id or a namespace. 
Tenant authorization is enabled through `tenant_atoken`, a bearer token delegated to the Orchestrator by the Tenant or Tenant's agent. 
Provider already have an existing relationship with SpartanX (not shown in the diagram), and the provider_token authenticates 
Provider to SpartanX. 

`AddToTenentApp(provider_token, app_id, public_key_fp, node_id)`

Adds fingerprint of the public key generated inside the new instance to the associated app id.

`RemoveFromTenentApp(provider_token, app_id, public_key_fp)`

Remove the public_key fingerprint from the app id. This function is invoked by Orchestrator when the instance is killed or ceased to exist.

`RevokeTenentAppAccess(provider_token, app_id)`

Remove Orchestrator authorization on the given app id.

`tenant_atoken`: Bearer token passed by tenant to the Orchestrator. Orchestrator API would be invoked directly by tenant SRE or
through tenant’s CI/CD deployment job. `tenant_atoken` is used by Orchestrator to get authorization to deploy application behalf
of the owner (See my tech talk [slides](https://www.slideshare.net/BinuRamakrishnan/securing-application-deployments-in-multitenant-cicd-environments)
on _Securing Application Deployments in Multi-tenant CI/CD Environments_.

`provider_token`:  A token that identifies the orchestrator.

`app_id`:  Application id, recognized by SpartanX

`node_id`:  The identity of the worker node from which cert request is allowed for a given public key/app_id pair. 
Typically a worker node is authenticated through mutual TLS. The node id is CNAME/SAN of a X509 certificate used by 
Node agent for client authentication.

### Variations
There are multiple ways to bootstrap service identity in a PAAS environment. An alternate option is where the SpartanX depends
on Orchestrator to return `app_id`, `public_key_fp` and `node_id` bindings. In that case SpartanX is nothing but a proxy that queries
Orchestrator and issues certificates based on the response. In such models, we may end up overly trusting Orchestrator.  

### Notes
An Orchestrator typically consists of a master node and a worker node agent. The agent runs on a worker node and their primary 
function is to help and support the master node to launch and manage instances running on that node.
