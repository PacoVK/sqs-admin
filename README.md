<p align="center">
  <img src="https://github.com/user-attachments/assets/11fe5716-16c6-46e5-b64f-a992c2ba0773" />
</p>

<p>  
  <a href="https://github.com/PacoVK/sqs-admin?tab=readme-ov-file#contributors-">
    <img alt="Contributors" src="https://img.shields.io/github/all-contributors/pacovk/sqs-admin">
  </a>
  <a href="https://hub.docker.com/r/pacovk/sqs-admin">
    <img alt="Docker Pulls" src="https://img.shields.io/docker/pulls/pacovk/sqs-admin">
  </a>
  <a href="https://cdn.localstack.cloud/gh/extension-badge.svg">
    <img alt="Localstack extension" src="https://cdn.localstack.cloud/gh/extension-badge.svg">
  </a>
</p>

A minimal and lightweight UI for managing SQS-Queues for local development e.g. with [Localstack](https://localstack.cloud/).

![Sqs-Admin](screenshot.png)

## Why

There are already good UIs for SQS, but they are heavy with sizes >100 MB. Most likely because they ship with SQS itself.
If you choose e.g. Localstack for local development you don't need an additional local SQS setup, as it is already
provided by Localstack, unfortunately without UI.
**This image has a size ~8 MB**. You can easily manage and create Queues.

## Usage

### Standalone Mode

The most common way to use SQS-Admin would be in conjunction with a `docker-compose.yml`.
A working example can be found in the `example` directory.

You probably need to have a SQS up and running somewhere to connect to, e.g. via Localstack.
To start SQS-Admin simply run:
`docker run --rm -p 3999:3999 -e SQS_ENDPOINT_URL=<Endpoint-URL-of-our-SQS> -d pacovk/sqs-admin`

### LocalStack Extension

SQS-Admin can also be used as a LocalStack extension, which provides a more integrated experience.

More details [here](./localstack/README.md).

## Compatibility

SQS-Admin >= 0.5.4 does not support Localstack < 2.x. 
If you need to stick to Localstack 1.x, please use SQS-Admin <= 0.5.3 ([see #928](https://github.com/PacoVK/sqs-admin/issues/928))

## Configuration

You can easily configure the Docker Container via the following environment variables:

| ENV              | Description                                                    | Default               |
| ---------------- | -------------------------------------------------------------- | --------------------- |
| SQS_ENDPOINT_URL | **Endpoint where SQS is running, this one is mostly required** | http://localhost:4566 |
| SQS_AWS_REGION   | AWS region the client internally uses to interact with SQS     | eu-central-1          |

## Contributing

If you want to contribute to this project, please read the [contribution guidelines](./CONTRIBUTING.md).

## Development

### Run local environment

To start your local development environment you can run `make dev`. This will start a local backend (default http://localhost:3999) and the UI (default http://localhost:3000).

The frontend is built with Vite for a faster and more efficient development experience.

To configure the backend for local development you can set the following environment variable:

| ENV       | Description                                            | Default |
| --------- | ------------------------------------------------------ | ------- |
| HTTP_PORT | Port that the internal backend binds to and is serving | 3999    |

### Run tests

To run the tests you can run `make test`. You'll need to shut down your local development environment afterward.

### Shutdown local environment

To shutdown your local development environment you can run `make down`.

### Release

To release a new version: 
* Update `vite.config.ts` 
* Update `package.json`
* Update `./localstack/pyproject.toml`
* Create a new release on GitHub

## Designed and tested with

![Localstack](https://raw.githubusercontent.com/localstack/.github/main/assets/localstack-readme-banner.svg)

## Contributors ✨

Thanks go to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://pascal.euhus.dev/"><img src="https://avatars.githubusercontent.com/u/27785614?v=4?s=100" width="100px;" alt="PacoVK"/><br /><sub><b>PacoVK</b></sub></a><br /><a href="https://github.com/PacoVK/sqs-admin/commits?author=PacoVK" title="Code">💻</a> <a href="https://github.com/PacoVK/sqs-admin/pulls?q=is%3Apr+reviewed-by%3APacoVK" title="Reviewed Pull Requests">👀</a> <a href="#projectManagement-PacoVK" title="Project Management">📆</a> <a href="#maintenance-PacoVK" title="Maintenance">🚧</a> <a href="#example-PacoVK" title="Examples">💡</a></td>
      <td align="center" valign="top" width="14.28%"><a href="http://erico.dev.br"><img src="https://avatars.githubusercontent.com/u/10657645?v=4?s=100" width="100px;" alt="Érico Knapp Lutzer"/><br /><sub><b>Érico Knapp Lutzer</b></sub></a><br /><a href="https://github.com/PacoVK/sqs-admin/commits?author=klutzer" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/stasadev"><img src="https://avatars.githubusercontent.com/u/24270994?v=4?s=100" width="100px;" alt="Stanislav Zhuk"/><br /><sub><b>Stanislav Zhuk</b></sub></a><br /><a href="https://github.com/PacoVK/sqs-admin/commits?author=stasadev" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/AlejandroPerez92"><img src="https://avatars.githubusercontent.com/u/112934187?v=4?s=100" width="100px;" alt="Alejandro Perez"/><br /><sub><b>Alejandro Perez</b></sub></a><br /><a href="https://github.com/PacoVK/sqs-admin/commits?author=AlejandroPerez92" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/adambordas"><img src="https://avatars.githubusercontent.com/u/6266706?v=4?s=100" width="100px;" alt="Ádám Bordás"/><br /><sub><b>Ádám Bordás</b></sub></a><br /><a href="https://github.com/PacoVK/sqs-admin/issues?q=author%3Aadambordas" title="Bug reports">🐛</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/bhavishyachandra"><img src="https://avatars.githubusercontent.com/u/10553920?v=4?s=100" width="100px;" alt="Bhavishya Chandra Kamineni"/><br /><sub><b>Bhavishya Chandra Kamineni</b></sub></a><br /><a href="https://github.com/PacoVK/sqs-admin/commits?author=bhavishyachandra" title="Code">💻</a></td>
      <td align="center" valign="top" width="14.28%"><a href="https://www.danielneto.pt"><img src="https://avatars.githubusercontent.com/u/10155766?v=4?s=100" width="100px;" alt="Daniel Neto"/><br /><sub><b>Daniel Neto</b></sub></a><br /><a href="https://github.com/PacoVK/sqs-admin/commits?author=danielnetop" title="Code">💻</a></td>
    </tr>
  </tbody>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

#### Legal note

UI favicon by [John Sorrentino](https://favicon.io/emoji-favicons/cowboy-hat-face)
