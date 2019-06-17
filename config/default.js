'use strict';

module.exports = {
    webApi: process.env.WEB_API_URL || "http://localhost:4000",
    nats: process.env.NATS_URL || "nats://localhost:4222",
    stackId: process.env.STACK_ID,
    stackName: process.env.STACK_NAME || "helloworld"
}
