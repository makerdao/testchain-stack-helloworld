
# Hello World Stack Service

## Prerequisite Installations

-   [Node](https://nodejs.org/en/download/) (Version >= 8.9.0)
-   [Yarn](https://yarnpkg.com/en/)
-   [Docker Compose](https://docs.docker.com/compose/)
    -   The docker compose service manages all the docker images needed for the setup and use of the testchain environment.
-   [Testchain-backendgateway](https://github.com/makerdao/testchain-backendgateway)
    -   Instructions on getting the local testchain setup and running are below.

## Testchain Installation

Before starting, you should confirm that you have docker compose up and running. You can check this by looking in the top right side of your computer screen, and selecting the whale icon for more details about running docker. You can also check this by running `docker info`.

## Getting Started

In order to get started with stacks, we first need to get the testchain up and running. Follow the steps below to do so:

1.  Open up a fresh new terminal window.
2.  `git clone git@github.com:makerdao/testchain-backendgateway.git`
3.  `cd testchain-backendgateway`
    1.  Check to make sure it is up to date by running `git pull`.
    2.  Check out `develop` branch `git checkout develop`.

## Getting the testchain up and running

1.  The next step is to pull everything from the docker container:
    
    1.  Run `make run-dev`
        1.  This step pulls all the images from docker down and will start the QA portal in docker images and then will set `localhost:4001` for the UI and `localhost:4000` for the WS/Web API.
        2.  You will see that it will immediately start pulling from the testchain-backendgateway.
    
    If you had some `testchain-***` docker images you have to run `make upgrade-dev` before running `make run-dev`.
    
2.  Once everything has been pulled down, the next step is to check the logs:
    
    1.  Run `make logs-dev`
        1.  This command will display all the logs from testchain network.
        2.  When running this, you want to keep an eye out for the first code block to confirm. This will confirm that it is indeed working for you.

The first block should appear in your terminal window as follows:

```
master ✓ make logs-deploy
Attaching to testchain-deployment.local
testchain-deployment.local  | time="2019-04-11T07:56:14Z" level=info msg="Config loaded" app=TCD
testchain-deployment.local  | time="2019-04-11T07:56:14Z" level=debug msg="Config: &{Server:HTTP Host:testchain-deployment Port:5001 Deploy:{DeploymentDirPath:/deployment DeploymentSubPath:./ ResultSubPath:out/addresses.json} Gateway:{Host:testchain-backendgateway.local Port:4000 ClientTimeoutInSecond:5 RegisterPeriodInSec:10} Github:{RepoOwner:makerdao RepoName:testchain-dss-deployment-scripts DefaultCheckoutTarget:tags/qa-deploy} NATS:{ErrorTopic:error GroupName:testchain-deployment TopicPrefix:Prefix Servers:nats://nats.local:4222 MaxReconnect:3 ReconnectWaitSec:1} LogLevel:debug}" app=TCD
testchain-deployment.local  | time="2019-04-11T07:56:14Z" level=info msg="Start service with host: testchain-deployment, port: 5001" app=TCD
testchain-deployment.local  | time="2019-04-11T07:56:14Z" level=info msg="First update src started, it takes a few minutes" app=TCD

```

After the appearance of the first code block, you will have to wait a few minutes (maximum) before it has fully booted.

Once the testchain has fully booted, you will see similar output as displayed below (this will constantly update as you interact with testchain services):

```
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="First update src finished" app=TCD
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="Used HTTP server" app=TCD
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="HTTP method added: GetInfo" app=TCD component=httpServer
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="HTTP method added: Run" app=TCD component=httpServer
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="HTTP method added: UpdateSource" app=TCD component=httpServer
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="HTTP method added: GetResult" app=TCD component=httpServer
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="HTTP method added: GetCommitList" app=TCD component=httpServer
testchain-deployment.local  | time="2019-04-11T08:07:28Z" level=info msg="HTTP method added: Checkout" app=TCD component=httpServer
testchain-deployment.local  | time="2019-04-11T08:07:38Z" level=debug msg="Request data: {\\\\"id\\\\":\\\\"\\\\",\\\\"method\\\\":\\\\"RegisterDeployment\\\\",\\\\"data\\\\":{\\\\"host\\\\":\\\\"testchain-deployment\\\\",\\\\"port\\\\":5001}}" app=TCD component=gateway_client
testchain-deployment.local  | time="2019-04-11T08:07:38Z" level=debug msg="Request data" app=TCD component=httpServer data="{}" method=GetInfo

```

After that you will have to download latest deployment scripts:

```
curl --request POST \\
--url [<http://localhost:5001/rpc>](<http://localhost:5001/rpc>) \\
--header 'content-type: application/json' \\
--data '{
"id": "some_id",
"method": "Checkout",
"data": {
"commit": "tags/staxx-deploy"
}
}'

```

Your testchain is now up and running!

### **Debugging your Stack**

In terms of debugging your stack from the logs, the most common issue that arises is in relation to outdated docker images.

**Fixes for issues with docker images:**

1.  The first option is to simply run **`make upgrade-dev`**. This command will upgrade all of your docker images to the most updated version.

**If the first option does not work for you, please follow the below steps:**

2.  In the case that you have used docker in the past for other projects and your images are scattered, you may have to refresh your whole system. To do so, run the following commands:

-   `make upgrade-dev`
-   `make rm-dev`
    -   This commands checks/confirms that the containers have stopped.
-   The following command ensures we do not have any lingering chains left over from a past deployment: `rm -r /tmp/chains /tmp/snapshots`
-   Run `docker images`
    -   Make sure you see the most recent version of the testchain_backendgateway present!

**Other Potential Bugs/Issues:**

-   **Question:** "What if I can't find the hello world containers running?"
- **Answer:**
    -   If it can't fetch the deployment steps, you would see something like `failed to fetch deployments`
    -   If it fetches the steps correctly, but the deployment still fails you would see something such as `deployment failed` alongside a long list of error messaging.
-   **Question:** When running an instance within the `Default Chain - No Deployment`. Does it require a particular deployment step to be completed first?
   -  **Answer:** 
	   - A step needs to be selected in order to trigger the deployment service. Currently, the step selection no longer matters, since there is only one config: `deploy-testchain.json`
	        -  Reference: [](https://github.com/makerdao/dss-deploy-scripts)[https://github.com/makerdao/dss-deploy-scripts](https://github.com/makerdao/dss-deploy-scripts)

## Full List of Testchain Commands (Docker Compose):

-   `make run-dev`
    -   This command will start the QA portal in docker images and will then set it to `localhost:4001` for the UI view and `localhost:4000` for the WS/Web API.
-   `make logs-dev`
    -   This command will display all of the logs from system.
-   `make logs-deploy`
    -   This command will display a list of logs for deployment service/everything you will need to get it up and running.
-   `make stop-dev`
    -   This command stops all services.
-   `make rm-dev`
    -   This command will remove local containers (not the images, only the containers)
-   `make upgrade-dev`
    -   This command will stop all of the running containers and remove them as well as images.

# Introduction to the _Hello World_ Stack Template

## Overview of a Stack

A Stack is a collection of backend services brought together for a specific purpose.

## **What is a `Stack Manager Service`?**

In short, the stack manager service is essentially a plugin interface for a specific stack you want to work with. For example, the Testchain Vulcanize DB stack manager service will handle a list of events from testchain.

### Other Examples of Stack Manager Service:

-   VulcanizeDB Stack
-   Price Oracles Stack
-   Keepers

## Installation

1.  First, confirm that you have the testchain up and running.
2.  Next, clone the repository by running: `git clone git@github.com:makerdao/testchain-stack-helloworld.git`
3.  Switch into the following directory: `cd testchain-stack-helloworld`
4.  We will now install the stack template by running: `make install`
    1.  This install will copy the stack_config from cwd to the correct location.
    2.  In the case of a `permission denied` error, you might need to run that as `root`. Run `sudo make install`
5.  Set up all of the config files you will need automatically.
6.  Last step is to pull the docker images locally by running: `make docker-pull`

**Important Note**

The Hello World stack contains two different services:

-   Manager Service
-   Display Service
    -   This service does nothing except bounce an http server and display all the environment variables within it.
    -   The idea here is that when you fork this Hello World template, you will then need to remove the display folder contents and start building your own by adding your code / containers.

**The current Display service folder includes:**

-   Dockerfile
-   index.js
-   Makefile
-   package.json
-   package-lock.json

## Stack Configuration

All details that are within the `stack_config` should be placed into the stacks config folder.

If you are using `docker-compose` for starting the Testchain Dashboard from [](https://github.com/makerdao/testchain-backendgateway)[https://github.com/makerdao/testchain-backendgateway](https://github.com/makerdao/testchain-backendgateway), you have to place two files from `stack_config` into the `/tmp/stacks/helloworld` folder on your machine and only after this should you start the local environment.

**The Stack configuration folder consists of 2 files:**
-   `stack.json`: The main stack configuration
-  `icon.png`: The stack icon for QA dashboard UI

For example, with the *Hello World* Stack, you must place the config in the `/tmp/stacks/helloworld`'s stack.json file.

**Example:**

```
{
  "title": "Hello World Stack",
  "name": "helloworld",
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

**Property list:**

-   `title` - the stack title
-   `scope` - the stack scope
-   `manager` - the stack manager service
-   `deps` - the stack dependencies

**Note:** containers, display and image are all come from the docker service.

## Starting your Stack

Once the config is set up, you can now get your stack up and running! This process involves one request to the backend service.

To start it, you must run `POST /stack/start with a payload`:

```
{
  "testchain": { // <-- Testchain configs
    "config": {
      "type": "geth", // "ganache" | "geth_vdb"
      "accounts": 2, // Amount of accounts need to be created
      "block_mine_time": 0, // Block mining time
      "clean_on_stop": true, // Remove all files after testchain is stopped
      "snapshot_id": null, // Snapshot ID
      "deploy_tag": null, // tag or commit id we need to switch before deployemnt
      "step_id": 1 // deployment step
    },
    "deps": [] // For the testchain there are no dependencies
  },
  "helloworld": { // <-- (Your stack name goes here)
    "config": {}, // see config section above to be added
    "deps": [  // Must wait util the testchain has started
      "testchain"
    ]
  }
}

```

**Example:**

```
curl --request POST \\
  --url <http://localhost:4000/stack/start> \\
  --header 'content-type: application/json' \\
  --data '{
  "testchain": {
    "config": {
      "type": "geth",
      "accounts": 2,
      "block_mine_time": 0,
      "clean_on_stop": true,
      "snapshot_id": null,
      "step_id": 1
    },
    "deps": []
  },
  "helloworld": {
    "config": {},
    "deps": ["testchain"]
  }
}'

```

**The response will look like the following:**

```
{
  "status": 0, // 0 - success, 1 - error
  "message": "",
  "errors": [],
  "data": {
    "id": "5341658974976052158" // Generated stack ID
  }
}

```

### **List of Other Stack Commands:**

-   `GET /stack/stop/{stack_id}`: Stopping your stack.
-   `GET /stack/info/{stack_id}`:  Retrieving information (exported resources) from the stack.
-   `POST /stack/notify`:  Sending notifications.
-    `POST /stack/notify/ready`: Sending notification that stack is ready.
-    `POST /stack/notify/failed`: Sending notification that stack has failed.
-    `POST /docker/start`: Starting a new docker container.
-   `GET /chain/{stack_id}`: Getting the testchain details.

## Stack Manager Container

When the system starts and spawns a new testchain (EVM), it starts the stack manager services simultaneously.

When the testchain-backendgateway starts a new stack manager service, it will pass a list of default ENV values such as:

-   `STACK_ID`: The deployment scope ID that the stack is related to.
-   `STACK_NAME`: The name of the stack. 
	- In this example, it will be `helloworld`
-   `WEB_API_URL`: Full URL for the backendgateway API service.
-   `NATS_URL` : The [NATS.io](http://nats.io/) event bus address for handling testchain events.

**Example:**

```
"STACK_ID" => "861259430136224875",
"STACK_NAME" => "helloworld",
"WEB_API_URL" => "<http://host.docker.internal:4000>",
"NATS_URL" => "<http://host.docker.internal:4222>"

```

When using these ENV values, the Stack manager service should subscribe to the NATS event bus by topic `chain.${stack_id}`.

After subscribing to the service, you will receive all [events](https://github.com/makerdao/testchain-backendgateway/blob/master/docs/EVENTS.md) for the started testchain. In this example, we are looking for the `deployed` event to retrieve a list of available contracts.

-   See the [src/nats.js](https://www.notion.so/makerdao/src/nats.js) file to learn more about the subscribing details.

Due to the fact that the deployment process and stacks are started asynchronously there might be a situation when the deployment process is finished before the Stack manager service has started.

**In order to handle such a situation, there is a little trick you can perform:**

- When the manager service has started, you have to fetch the testchain details and check the `status` of it.

- Note that if the status is set to `ready` , the deployment details will be displayed in the `deploy_data` field.

**Example:**

```
const details = await web_api.get_chain_info();

/**
 * Why it's added here ?
 * For example: we might have a testchain with all deployed contracts and all details
 * already ready to be used (if service started after `deployed` event sent).
 * In that case, we are able to start required image and not to wait for `deployed` event again
 */
if (details.status == 'ready' && _.isObject(details.deploy_data)) {
  // Do some required work here
}

// Connect to Nats
const nc = await nats.connect(this.onMessage.bind(this))

```

## Stack Network

All Stack services/containers will be started within one docker network. When starting a new scope, the system will create a new docker Network with same ID as the deployment scope ID. Once this has occurred, all containers/services in this network will be added automatically.

## Starting Additional Containers

The Stack manager service can only start containers that are listed in stack configuration. This means that if you need to start another service/container after it is `deployed` , you will have to list that container within the configuration.

In order to start a new container, you have to call `POST ${WEB_API}/docker/start`'s route.

**Example:**

```
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

## [Reference for Full Backend API Setup](https://github.com/makerdao/testchain-backendgateway/blob/master/docs/API.md)

In order to get the output from the display service, you will have to call stack/info using the following command:

```
curl --request GET \\
--url [<http://localhost:4000/stack/info/565185822213366414>](<http://localhost:4000/stack/info/565185822213366414>)

```

As a result, you will get all the details about the started containers and all of the ports that are accessible to you.

**Example:**

```
{
"status": 0,
"message": "",
"errors": [],
"data": [
{
"status": "ready",
"stack_name": "helloworld",
"containers": [
{
"ports": [],
"network": "10597306092771222200",
"name": "zyeluueopl9nzcsx3w10vjjsjtlfzpzjb8umifxuf03tvj",
"image": "makerdao/testchain-stack-helloworld",
"id": "0d52da91cb3fd60f4ce60dd65d256d04dad90ea997ca8cb80fe562c4774eec0b",
"env": {
"WEB_API_URL": "[<http://host.docker.internal:4000>](<http://host.docker.internal:4000/>)",
"STACK_NAME": "helloworld",
"STACK_ID": "10597306092771222200",
"NATS_URL": "[<http://host.docker.internal:4222>](<http://host.docker.internal:4222/>)"
},
"description": ""
},
{
"ports": [
{
"54723": 3000
}
],
"network": "10597306092771222200",
"name": "tm1vmcvrn9kh09d89uqmpto6igebykhfyrijbyuzmwznrg",
"image": "makerdao/testchain-stack-helloworld-display",
"id": "45944ae39ec70cb9a12de77329b89a8de4a5381657e6efc27b9fb1457b9f5f9c",
"env": {
"WEB_API_URL": "[<http://host.docker.internal:4000>](<http://host.docker.internal:4000/>)",
"STACK_NAME": "helloworld",
"STACK_ID": "10597306092771222200",
"NATS_URL": "[<http://host.docker.internal:4222>](<http://host.docker.internal:4222/>)",
"CONTRACT_ADDRESS_VOW": "0x6924bac9a194ec62014db1045eaa5bdbf1c58bbe",
"CONTRACT_ADDRESS_VAT": "0x6a1ebcc631bcf15814a76330ffae046c5a6b36bb",
"CONTRACT_ADDRESS_REP": "0x2a775d6e81b0320137858e047e0d28877e41ef54",
"CONTRACT_ADDRESS_PIP": "0x0838c88dc2d066e13812bfd67ba020c26b6dcd98",
"CONTRACT_ADDRESS_PEP": "0x4dcd2d0155f936092315a48a1996834f6811d054",
"CONTRACT_ADDRESS_MCD_FLOP": "0x635c001627ea3eae8ff01e7239d467c202cdef91",
"CONTRACT_ADDRESS_MCD_FLAP": "0xe7855a952fad1ce7757fc422cbe2957bfeda7e19",
"CONTRACT_ADDRESS_DRIP": "0x47a38f83ca6ba5031fe2f76adb45f32a4f4f02d8",
"CONTRACT_ADDRESS_CAT": "0x15bd31c414c8642355249f427c4afe7aa8ea3fa0"
},
"description": ""
}
]
}
]
}
```
