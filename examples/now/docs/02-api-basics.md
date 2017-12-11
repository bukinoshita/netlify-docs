## API Basics

Our API is exposed as an HTTP/1 and HTTP/2 service over SSL.

All endpoints live under the URL `https://api.zeit.co/now` and then generally
follow the REST architecture.

### Content Type

All requests must be encoded as JSON with the `Content-Type: application/json`
header. Most responses, including errors, are encoded exclusively as JSON as
well.

### Authentication

Provide your API token as part of the `Authorization` header.

```
Authorization: Bearer jkEj38dkaAMp80
```

To act on resources owned by a team add `teamId` query string at the end of an
API URL and use the teamId as the value.

```
https://api.zeit.co/example?teamId=team_123
```

> NOTE: Since you're logged in, the examples in the API will contain your secret
> token. Don't share them! For example, to get a
> [list of deployments](https://zeit.co/api#endpoints) try the following:

```
▲ curl -H "Authorization: Bearer jkEj38dkaAMp80" https://api.zeit.co/now/deployments
```

If the authentication is unsuccessful, the status code **403** is returned.

### Errors

All errors have the following format:

```
{
  "error": {
    "code": "error_code",
    "message": "An english description of the error that just occurred",
    "url": "https://zeit.co/errors/endpoint/error_code"
   }
}
```

The possible `error_code` values are documented on a per-endpoint basis.

Since the `message` is bound to change over time, we recommend you do not pass
it along directly to end-users of your application.

Finally, we provide a help link that will give you information about the
specific error you just received to make debugging easier! This link is generic
and not exclusive to your application or data.

### Generic error codes

Some error codes are consistent for all endpoints:

* **authentication_error**: Authentication failed.
* **rate_limited**: You exceeded the maximum alloted requests.
* **bad_request**: Some required parameters were not present or were invalid.
* **internal_server_error**: An unexpected server error occurred.

### Rate limits

We limit the number of calls you can make over a certain period of time.

Rate limits vary and are specified by the following header in all responses:

* **X-Rate-Limit-Limit**: The maximum number of requests that the consumer is
  permitted to make per minute.
* **X-Rate-Limit-Remaining**: The number of requests remaining in the current
  rate limit window.
* **X-Rate-Limit-Reset**: The time at which the current rate limit window resets
  in UTC epoch seconds.

When the rate limit is **exceeded** an error is returned with the status **429
Too Many Requests**:

```
{
  "error": {
    "code": "rate_limited",
    "message": "An english description of the error that just occurred",
    "url": "https://zeit.co/errors/rate_limited"
  }
}
```

### Versioning

We try to avoid breaking backwards-compatibility as much as possible.

In the rare event that we would need to change an endpoint in a very substantial
way, we simply will introduce an alternative way of accessing the resource,
under a different path.

Some API endpoints, however, are flagged as **EXPERIMENTAL**. If this is the
case, we might deprecate or change the shape of the response over time by
appending a version prefix. For example, `/create` might evolve into
`/v2/create`. When the experimental status is removed, so is the prefix.
