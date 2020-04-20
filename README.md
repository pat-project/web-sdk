# Pat web SDK

If you'd like to write a web based application capable of interfacing with Pat
data, then you're in the right spot. This is the web targeting SDK used in the
upcoming modelling application.

## Running the tests

Because of the use of `SubtleCrypto` within the SDK, you'll need to have a
valid SSL key pair in the root of the project before starting the test server. 

> For the curious ones out there, this is because the `SubtleCrypto` API is
> only made available in _secure_ contexts.

To generate a valid SSL key pair, run the command below (assuming you're using
a NIX environment) and answer the questions with dummy stock data when
prompted.

```bash
openssl req -nodes -new -x509 -keyout server.key -out server.cert
```

## License

This project is released under the Apache License, Version 2.0. You can find
the [full license here](./LICENSE).

