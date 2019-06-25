# Hello World stack service

this service does nothing except of show how everything is working.

## Stack config

All details that are into `stack_config` should be places into stacks config folder.
If you are using `docker-compose` for starting QA Dashboard from https://github.com/makerdao/testchain-backendgateway

You have to place 2 files from `stack_config` into `/tmp/stacks/helloworld` folder
on your machine and only after this to start local env.

## Installation
You could use `make install` command to place all required config files into correct location.

## Configuration
Stack configuration

```js
{
  "title": "Hello World Stack",
  "scope": "global",
  "manager": "makerdao/testchain-stack-helloworld",
  "deps": [
    "testchain"
  ],
  "containers": {
    "display": {
      "image": "makerdao/testchain-stack-helloworld-display",
      "ports": [3000]
    }
  }
}
```

Where:

 - `title` - Stack title (any string that will describe stack)
 - `scope` - Stack scope (Any of `global | org | user | sandbox`)
 - `manager` - Stack manager service (docker image that should be started with new chain)
 - `deps` - List of dependencies for Stack. Example: `testchain` - stack depends on testchain
 - `containers` - List of containers that are allowed to be started by Stack.

Containers definitions:

```js
"title": { // Custom title
  "image": "some-docker-image", // Docker image
  "ports": [3000] // list of ports that should be exported for public access
}
```

## Stack Manager container
When system starts and spawns new testchain (EVM) it start stack manager services as well.
When backendgateway starts new stack manager service it will pass list of default ENV values:

 - `STACK_ID` - Deployment scope ID that stack is related to
 - `STACK_NAME` - Name of the stack. (In this example it will be `helloworld`)
 - `WEB_API_URL` - Full URI for backendGateway API service
 - `NATS_URL` - NATS.io event bus address for handling chain events

Example:
```
"STACK_ID" => "861259430136224875",
"STACK_NAME" => "helloworld",
"WEB_API_URL" => "http://host.docker.internal:4000",
"NATS_URL" => "http://host.docker.internal:4222"
```

Using this ENV values Stack manager service should subscribe to NATS event bus by topic `chain.${stack_id}`.
After subscribing service will receive all [events](https://github.com/makerdao/testchain-backendgateway/blob/master/docs/EVENTS.md) for started chain.
In this example we care about `deployed` event to get list of available contracts.

Example:
```js
{
  MULTICALL: '0x4040e065649a8997edc43719806a25d2de4091e1',
  GET_CDPS: '0x83d69c5cfccdb0fac939b93e969f50ce4a4a5ff2',
  MCD_GOV_GUARD: '0x418f708429f2667349e66ea2b9d52092c60e3328',
  MCD_VOW: '0x6836cab7cd0688cfa89521bc56b6b43518f27609',
  VAL_ETH: '0x32c24df288bc7f9ccedaacc0631233200c46dffb',
  COL1: '0xf129b292c81669d4aaa5b93fa6184f75ac0954da',
  MCD_POT: '0x98a8119e0ce06c6cedb4534621472b4621581b64',
  MCD_CAT: '0x26cdb58bc553cf4b38813b851d747a4e774ec668',
  MCD_JOIN_ETH_B: '0xf2f9680557b6f6263f2b495f64d08d13a15be678',
  MCD_ADM: '0xea09edc0f9028d4adb728dc690bf4719ca95294d',
  PIP_ETH: '0x32c24df288bc7f9ccedaacc0631233200c46dffb',
  MCD_JOIN_DAI: '0x17fd48c8eb6cf2641f0a21703f1dffe285514180',
  MCD_FLIP_ETH_B: '0x601042a16cfb1200b7bcdfe6902aaa0b4cf433cf',
  MCD_GOV: '0x0c733007b43b95630953f5d7932331b2cc792738',
  PROXY_FACTORY: '0xa9612c5ae0d90db0e16f989f1a4b79446952c194',
  ETH: '0x3b2731c6353c06a798f07cc261cc644b09b5626d',
  PROXY_REGISTRY: '0xcb6c14076a664fef7e56202fde6d533321da9c75',
  MCD_PAUSE_PLAN: '0x7f20f3845520ec0f5181de8d2973d48130388ff9',
  VOTE_PROXY_FACTORY: '0x9bef9b0833585b40f8bf08b1e59bc44aca4c952b',
  VAL_COL1: '0xbc3ff599b5d33ebf8929abe273ddb98cbeb18fba',
  PIP_COL1: '0xbc3ff599b5d33ebf8929abe273ddb98cbeb18fba',
  MCD_FLAP: '0x9bcbce9fe0cf85b6569822d4c8b2b289253a6b26',
  MCD_DEPLOY: '0x633765e0355b469ad8001263a5883f4df8956448',
  MCD_JOIN_ETH_A: '0x49b4a5332851948ddf82fe40aa6bbf3900e1b5a2',
  MCD_FLOP: '0x66de411c6cd668a9bb38a63370eae5296ca89746',
  MCD_FLIP_ETH_A: '0xe2ed23976d27ed7e87f7565480b8c46215764b3e',
  MCD_JOIN_COL1_A: '0xcc132a2b177304403537bfad9aefb7a4f6160686',
  MCD_PAUSE: '0xd025a2d99ca9e8be75e6dcd14a263ed8a12bd877',
  CDP_MANAGER: '0x0cf8a61ede2237fa3ca5a45a843b9a55d35dee01',
  PROXY_DEPLOYER: '0x7d88faae9c06d2022fd964a9122725dc69ab092c',
  PROXY_PAUSE_ACTIONS: '0x1c91afaabdadd1831bcedb73add073bcff5ed75c',
  MCD_DAI: '0x21b25889b725baf71c2982281d7e827a2055c0ff',
  MCD_SPOT: '0x2eec7e759ffc0de89a7b07c5702871af200a2294',
  FAUCET: '0xf660ad07e8b69d651d1fb2b9e21b956e9874d623',
  MCD_IOU: '0x94478f6508a6cfe88f494d65d583ed985bd94bb0',
  MCD_FLIP_COL1_A: '0xcdd1588a098550846630664a6a3e468b3e2a0d50',
  MCD_VAT: '0x60118417e4a3cfb4795f9577239f7353de3b2dd4',
  PROXY_ACTIONS: '0x4736786736a2d50f3c82aa0a772b121efbe3a0ee',
  MCD_JUG: '0xea2fc8fc171f014c0098dbfcc4bad40e78aea91b'
}
```

See [src/nats.js](src/nats.js) file for subscribing details.

Because deployment process and stacks are started asynchronously there might be a situation when deployment process finished before Stack manager service is started.
To handle such situation there is a little trick:
On manager service start you have to fetch chain details and check it's `status`.

If status is `ready` there will be also deployment details in `deploy_data` field.

Example:
```js
const details = await web_api.get_chain_info();

/**
 * Why it's added here ?
 * For example: we might have blockchain with all deployed contracts and all details
 * already ready to be used (if service started after `deployed` event sent).
 * In that case we are able to start required image and not to wait for `deployed` event again
 */
if (details.status == 'ready' && _.isObject(details.deploy_data)) {
  // Do some required work here
}

// Connect to Nats
const nc = await nats.connect(this.onMessage.bind(this))
```

## Stack network
All Stack services/container will be started in one docker network.
On starting new scope system will create new docker Network with same ID as deployment scope ID.
And after it will include all containers/services into this network automatically.

## Starting additional containers

Stack manager service could start only containers that are listed in stack configuration.
So if you need to start some service/container after `deployed` you have to list this container into configuration.


To Start new container you have to call `POST ${WEB_API}/docker/start` route.
Example:

```js
const details = {
  stack_id: Config.get('stackId'),
  stack_name: Config.get('stackName'),
  network: Config.get('stackId'),
  image: 'makerdao/testchain-stack-helloworld-display',
  ports: [3000],
  env: {
    CONTRACT_ADDRESS_CAT: contracts['MCD_CAT'],
    CONTRACT_ADDRESS_DRIP: contracts['MCD_JUG'],
    CONTRACT_ADDRESS_PEP: contracts['PIP_REP'],
    CONTRACT_ADDRESS_PIP: contracts['PIP_ETH'],
    CONTRACT_ADDRESS_PIT: contracts['MCD_PIT'],
    CONTRACT_ADDRESS_REP: contracts['REP'],
    CONTRACT_ADDRESS_VAT: contracts['MCD_VAT'],
    CONTRACT_ADDRESS_VOW: contracts['MCD_VOW'],
    CONTRACT_ADDRESS_MCD_FLAP: contracts['MCD_FLAP'],
    CONTRACT_ADDRESS_MCD_FLOP: contracts['MCD_FLOP'],
    CONTRACT_ADDRESS_ETH_FLIP: contracts['MCD_FLIP_ETH']
  }
}

request
  .post(`${Config.get('webApi')}/docker/start`)
  .send(details)
  .type('json')
  .then((data) => {

    if (!_.isObject(data.body) || data.body.status != 0 || !data.body.data) {
      console.error('Wrong docker start event', data.body)
      return Promise.reject(new Error('Wrong docker start response'))
    }
    return data.body.data
  })
```

[Docker container start API](https://github.com/makerdao/testchain-backendgateway/blob/master/docs/API.md#start-docker-container)

## Backend API

[Web API docs](https://github.com/makerdao/testchain-backendgateway/blob/master/docs/API.md)
