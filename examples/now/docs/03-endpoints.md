## Endpoints

This section describes all available endpoints.

### GET /now/deployments

List all the deployments under the account corresponding to the API token.

If a deployment hasn't finished uploading (is incomplete), the `url` property
will have a value of `null`.

Example successful (**200**) response:

```
{
  "deployments": [
    {
      "uid": "7Npest0z1zW5QVFfNDBId4BW",
      "name": "project-a",
      "url": "project-bfzfxvjaewj.now.sh",
      "created": "1460801613968"
    },
    {
      "uid": "dOgCUIoovYiYmXbrLX0h9qDk",
      "name": "project-b",
      "url": "project-b-iipihlfrpa.now.sh",
      "created": "1462738579605"
    }
  ]
}
```

### GET /now/deployments/:id

This API allows you to retrieve a deployment by supplying its **:id** in the
URL. You can obtain this, for example, by listing all deployments.

Example successful (**200**) response:

```
{
  "uid": "7Npest0z1zW5QVFfNDBId4BW",
  "host": "project-a-fzfxvjaewj.now.sh",
  "state": "READY",
  "stateTs": "2017-02-20T08:16:28.547Z"
}
```

The state field represents the current global state of the deployment. The state
diagram below presents the possible state transitions for a deployment in now. A
deployment remains in `DEPLOYING` state until all the required files are synced
to the cloud. `DEPLOYMENT_ERROR` is observed if the deployment kept crashing
after multiple restarts due to any reason; Or in an unlikely event of an
internal system error. A deployment in `READY` or `FROZEN` state is set to
receive traffic from the internet, while a deployment in `FROZEN` state isn't
actually running it will never lose new connections as it's restarted on-demand.

### DELETE /now/deployments/:id

This API allows you to delete a deployment by supplying its **:id** in the URL.
You can obtain the ID, for example, by listing all deployments.

### POST /now/deployments

Create a new deployment on the fly by supplying an **:id** in the URL and the
necessary file data in the body.

The body contains a special key `package` that has the `package.json` JSON
structure. Other keys will represent a file path, with their respective values
containing the file contents.

> **NOTE**: The code and logs under the OSS plan will be public.

Example request with a successful (**200**) response:

```
{
  "uid": "7Npest0z1zW5QVFfNDBId4BW",
  "host": "project-a-fzfxvjaewj.now.sh",
  "state": "BOOTING"
}
```

### GET /now/deployments/:id/files

This API allows you to retrieve the file structure of a deployment by supplying
its **:id** in the URL. The body will contain entries for each child and
directory, coupled with an ID of the file for content download.

Example successful (**200**) response:

```
[
  {
    "type": "directory",
      "name": "myfolder",
      "children": [
      {
        "type": "file",
        "name": "other.js",
        "uid": "074f89b7cec922f11815a9437b9f9e4ba6df598f"
      }
    ]
  },
  {
    "type": "file",
    "name": "start.js",
    "uid": "23507a2f215bf389a1bf25f9f8f1e782f50a890e"
  },
  {
    "type": "file",
    "name": "package.json",
    "uid": "9ea8930976aad4ebd005f8d6c03825be136cc4a9"
  }
]
```

### GET /now/deployments/:id/files/:file_id

This API allows you to retrieve the file data of a file associated with a
deployment by supplying its **:id** and **:file_id** in the URL. The body will
contain the raw content of the file

Example successful (**200**) response:

```
{
  "name": "project-a",
  "version": "0.0.1",
  "description": "",
  "scripts": {
    "start": "node start.js"
  },
  "dependencies": {
    "express": "4.13.4"
  }
}
```

### GET /domains

Retrieves a list of domains registered for the authenticating user. Each domain
entry contains an `aliases` array listing every alias associated with the
domain. The field `isExternal` is a boolean value telling wheter an external
nameserver is used to manage DNS records for the domain.

Example successful (**200**) response:

```
{
  "domains": [{
    "uid": "V0fra8eEgQwEpFhYG2vTzC3K",
    "created": "2016-09-23T11:53:38.600Z",
    "isExternal": false,
    "name": "zeit.rocks",
    "aliases": [
      "sqrBE5u452LPy3Ce0tLbazoY",
      "gqM3ZEM98W9oqAnq7sG2cMzQ"
    ]
  }]
}
```

### POST /domains

Register a new domain name with [now](https://zeit.co/now) for the
authenticating user. If the field `isExternal` is false a zeit.world DNS is
configured for the domain; Otherwise an external nameserver is expected to point
`CNAME/ALIAS` towards `alias.zeit.co`.

If an external nameserver is used the user must verify the domain name by
creating a TXT record for `_now` subdomain containing a verification token
provided as a POST result. After the record has been created, the user may retry
the same POST and the endpoint shall return `verified: true`, if the domain was
verified succesfully.

Example: Adding a zeit.world domain:

```
{
  name: "zeit.rocks",
  isExternal: false
}
```

Successful (**200**) response:

```
{
  uid: "V0fra8eEgQwEpFhYG2vTzC3K",
  verified: true,
  created: "2016-09-23T11:53:38.600Z"
}
```

Example: Unverified external domain:

```
{
  name: "awesome-now.us",
  isExternal: true
}
```

Successful (**200**) response:

```
{
  uid: "V0fra8eEgQwEpFhYG2vTzC3K",
  verified: false,
  verifyToken: "3f786850e387550fdab836ed7e6dc881de23001b",
  created: "2016-09-23T11:53:38.600Z"
}
```

### DELETE /domains/:name

Delete a previously registered domain name from [now](https://zeit.co/now).
Deleting a domain will automatically remove any associated aliases.

Example successful (**200**) response:

```
{
  uid: id
}
```

### GET /domains/:domain/records

Get a list of DNS records created for a domain name specified in the URL.

Example successful (**200**) response:

```
{
  "records": [
    {
      "id": "rec_38OtX1f51szRA03atCybBuZ3",
      "slug": "zeit.rocks.-address",
      "type": "ALIAS",
      "name": "",
      "value": "alias.zeit.co",
      "created": "1474631621542",
      "updated": null
    },
    {
      "id": "rec_Pxo2HEfutmlIYECtTE4SpDzY",
      "slug": "*.zeit.rocks.-address",
      "type": "CNAME",
      "name": "*",
      "value": "alias.zeit.co",
      "created": "1474631619960",
      "updated": null
    }
  ]
}
```

### POST /domains/:domain/records

Create a DNS record for a domain specified in the URL. `mxPriority` field should
be set for MX records and left out otherwise.

```
{
  "data": {
    "name": "subdomain",
    "type": "MX",
    "value": "mail.zeit.rocks",
    "mxPriority": 10
  }
}
```

Example successful (**200**) response:

```
{
  uid: "rec_V0fra8eEgQwEpFhYG2vTzC3K"
}
```

### DELETE /domains/:domain/records/:recId

Delete a DNS record created for a domain name, where both the domain and the
record ID are specified in the URL. If the record was removed succesfully the
endpoint returns with code **200** and an empty body.

### GET /now/certs/[:cn]

Retrieves a list of certificates issued for the authenticating user or
information about the certificate issued for the common name specified in the
URL.

Example successful (**200**) response:

```
{
  "certs": [
    {
      "cn": "testing.zeit.co",
      "uid": "oAjf6y9pxZgCJyQfrclN",
      "created": "2016-08-23T18:13:09.773Z",
      "expiration": "2016-12-16T16:00:00.000Z",
      "autoRenew": true
    }
  ]
}
```

### POST /now/certs

Issue a new certificate for the common names given in body. The body should
contain `domains` array and it may contain `renew` field to renew an existing
certificate. For example:

```
{
  "domains": ["testing.zeit.co"],
  "renew": true
}
```

Example successful (**200**) response:

```
{
  "uid": "zWsFytQUFlkUWaR7nWdwS7xR"
  "created_at": 2016-06-01T21:03:10.420Z"
}
```

### PUT /now/certs

Replace an existing or create a new certificate entry with a user-supplied
certificate. The body should contain `domains` field containing all the domains
the new certificate will be used for, and `cert`, private `key`, and `ca` chain
fields in PEM format. For example:

```
{
  "domains": ["testing.zeit.co"],
  "ca": "PEM formatted CA chain",
  "cert": "PEM formatted certificate",
  "key": "PEM formatted private key"
}
```

Example successful (**200**) response:

```
{
  "created_at": 2016-06-01T21:03:10.420Z"
}
```

### DELETE /now/certs/:cn

Delete an existing certificate entry. If the certificate entry was removed
successfully the endpoint will return with code **200** and an empty body;
Otherwise an error object is returned.

### GET /now/aliases

Retrieves all of the active now aliases for the authenticating user. The body
will contain an entry for each alias.

Example successful (**200**) response:

```
{
  "aliases": [
    {
      "uid": "2WjyKQmM8ZnGcJsPWMrHRHrE",
      "alias": "my-alias",
      "created": "2016-06-02T21:01:40.950Z",
      "deploymentId": "c9MrOWGzdJSfPxqyTDYhdEGN"
    },
    {
      "uid": "CR3bdJZkiaAuh9yr0OHXJJPG",
      "alias": "my-alias-2",
      "created": "2016-06-01T21:03:10.420Z",
      "deploymentId": "eD7FrslROGaXchymDD6ODw3v"
    }
  ]
}
```

### DELETE /now/aliases/:id

The API allows you to delete an alias by supplying the alias `:id` in the url.
You can obtain this id from the list of aliases.

Example successful (**200**) response:

```
{"status": "SUCCESS"}
```

### GET /now/deployments/:id/aliases

Retrieves all of the aliases for the deployment with the given `:id`. The
authenticating user must own this deployment. The body will contain an entry for
each alias.

Example successful (**200**) response:

```
{
  "aliases": [
    {
      "uid": "2WjyKQmM8ZnGcJsPWMrHRHrE",
      "alias": "my-alias",
      "created": "2016-06-02T21:01:40.950Z",
    }
  ]
}
```

### POST /now/deployments/:id/aliases

Creates a new alias for the deployment with the given `:id`. The authenticating
user must own this deployment. The JSON body of the POST should contain an
`alias` key with the desired alias (hostname or custom url).

Example successful (**200**) response for new alias:

```
{
  "uid": "2WjyKQmM8ZnGcJsPWMrHRHrE",
  "created": "2016-06-02T21:01:40.950Z"
}
```

Example successful (**200**) response for alias with existing deployment (oldId
is the id of the previous deployment):

```
{
  "oldId": "c9MrOWGzdJSfPxqyTDYhdEGN",
  "uid": "2WjyKQmM8ZnGcJsPWMrHRHrE",
  "created": "2016-06-02T21:01:40.950Z"
}
```

### GET /now/secrets

Retrieves all of the active now secrets for the authenticating user. The body
will contain an entry for each secret.

Example successful (**200**) response:

```
{
  "secrets": [
    {
      "uid": "sec_T70JHBhR1gqaxXVrLTsHr6B9",
      "name": "guillermo",
      "created": '2016-09-02T01:03:50.000Z'
    }
  ]
}
```

### POST /now/secrets

Creates a new secret. The body should contain `name` and `value` strings. For
example:

```
{
  "name": "my-api-key",
  "value": "my-value"
}
```

Example successful (**200**) response:

```
{
  "uid": "sec_zWsFytQUFlkUWaR7nWdwS7xR"
}
```

### PATCH /now/secrets/:uidOrName

This endpoint provides an opportunity to edit the `name` of a user's secret. The
name has to be unique to that user's secrets.

The body must contain a field `name` with the new name to use.

Example successful (**200**) response:

```
{
  "uid": "sec_zWsFytQUFlkUWaR7nWdwS7xR",
  "oldName": "my-api-key"
}
```

The `uid` returned is that of the matched secret.

### DELETE /now/secrets/:uidOrName

This deletes a user's secret.

Example successful (**200**) response:

```
{
  "uid": "sec_zWsFytQUFlkUWaR7nWdwS7xR"
}
```

The `uid` returned is that of the matched secret.
