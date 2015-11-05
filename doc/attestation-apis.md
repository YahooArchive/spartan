##Attestation Service APIs

The attestation service exposes only two APIs. 

NOTE: This info is not required for operating Spartan. However if you wanted to write Spartan API bindings for an unsupported language, this would be useful.

**Get app authorization cert tokens from Attestation Service**

----

* **URL:** `/v1/as/certs`

* **Method:** `POST`
  
*  **URL Params**
  None

* **Data Params**

  `{ token: '<self-signed jwt token>' }` // the exact token format is documented in jwt-tokens.md

  It is also possible to send the token using HTTP header : `x-spartan-auth-token`
  
* **Success Response:**

  * **Code:** 200 OK <br />
  * **Content-Type:** `application/json` <br />
    **Content:** 
```javascript
                   { certs: [ { role: '<requested-role>' , cert: 'eyJ0eXAiOi...' },
                              { role: '<requested-role>' , cert: 'eyDfghJXAi...' }, ... 
                            ] 
                   } // the exact token format is documented in jwt-tokens.md
```

* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
  * **Content-Type:** `application/json` <br />
    **Content:** `{ msg : "Invalid AppID" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
  * **Content-Type:** `application/json` <br />
    **Content:** `{ msg : "Invalid token/auth failed" }`

* **Sample Call:**

The recommended way is to use a spartan library. Refer demo/client/auth-test.js
  
**Get Attestation Service (AS) public key**
----
  Returns AS public key in `text/plain`

* **URL:** `/v1/as/publickey`

* **Method:** `GET`
  
*  **URL Params**
  None

* **Success Response:**

  * **Code:** 200 OK <br />
    **Content-Type:** text/plain <br />
    **Content:** `-----BEGIN PUBLIC KEY-----
MHYwEAYHKoZIzj0CAQYFK4EEACIDYgAE53B0XxV+ZhLlDXE/YW9WFEmILLW0y5x+
2d7aIW4m2KsNaJNL5IPV1Ct4mPUy9kUea5uaBGz57VKoi5A6i31ehIer5wmJvtQt
IoiheqVmLoAIiQmYx9N11GdbECoRg2rL
-----END PUBLIC KEY-----`

 
* **Error Response:**

  * **Code:** 404 NOT FOUND <br />
    **Content:** `{ msg : "Request resource not found" }`

  OR

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ msg : "Invalid token/auth failed" }`

* **Sample Call:**

  `curl https://<attestation-server-example.com>/v1/as/publickey`


