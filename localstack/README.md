SQS-Admin
===============================

![Install LocalStack Extension](https://cdn.localstack.cloud/gh/extension-badge.svg)

The LocalStack SQS-Admin extension is a simple, yet powerful UI to manage and interact with your SQS queues in LocalStack. 

## Get started

### Install

You can install the extension via the CLI

```bash
localstack extensions install sqs-admin
```

or add `sqs-admin` to the `EXTENSION_AUTO_INSTALL` environment variable.

Example:

```bash
localstack start -e EXTENSION_AUTO_INSTALL=sqs-admin
```

or via Docker compose by adding `EXTENSION_AUTO_INSTALL=sqs-admin` to the environment variables of the `localstack` service.

Example Docker compose:

```yaml
services:
  localstack:
    container_name: "localstack-main"
    image: localstack/localstack-pro
    ports:
      - "127.0.0.1:4566:4566"
      - "127.0.0.1:4510-4559:4510-4559"
    environment:
      - LOCALSTACK_AUTH_TOKEN=${LOCALSTACK_AUTH_TOKEN:?}
      - EXTENSION_AUTO_INSTALL=sqs-admin
```

### Configure

You can configure the extension by setting SQS-Admin environment variables:

Example:
  
```bash
localstack start -e SQS_AWS_REGION=us-east-2
```

### Use the extension

Navigate to http://sqs-admin.localhost.localstack.cloud:4566.

![Sqs-Admin](https://github.com/user-attachments/assets/08b05da2-8319-4370-9d7b-d9518b0ee054)

## Develop

To install the extension into localstack in developer mode, you will need Python 3.10, and create a virtual environment in the extensions project.
Please refer to the [LocalStack documentation](https://docs.localstack.cloud/user-guide/extensions/developing-extensions/) for more information.

### In short

In the newly generated project, simply run

```bash
make install
```

Mind that extensions require a pro version of LocalStack to be installed.
Ensure to the auth-token at hand or already set up:

```bash
localstack auth set-token <redacted-token>
```

Then, to enable the extension for LocalStack, run

```bash
localstack extensions dev enable .
```

You can then start LocalStack with `EXTENSION_DEV_MODE=1` to load all enabled extensions:

```bash
EXTENSION_DEV_MODE=1 localstack start
```
