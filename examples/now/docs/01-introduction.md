## Introduction

The [now](https://zeit.co/now) API enables you to dynamically and elastically
orchestrate Node deployments in the cloud. The entire power of our command-line
deployment tool is available for you to remix!

```
return fetch('https://api.zeit.co/now/instant', {
  method: 'POST',
  body: JSON.stringify({
    package: {
      name: 'my-instant-deployment',
      dependencies: {
        'sign-bunny': '1.0.0'
      },
      scripts: {
        start: 'node index'
      }
    },
    'index.js':
      'require("http").Server((req, res) => {' +
        'res.setHeader("Content-Type", "text/plain; charset=utf-8");' +
        'res.end(require("sign-bunny")("Hi there!"));' +
      '}).listen();'
  })
})
.then(function (res) { return res.json() })
.then(function (body) {
  if (body.host) window.location = 'https://' + body.host;
  return body;
});
```

[Deploy](https://my-instant-deployment-kkortmaosb.now.sh/)
