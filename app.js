const express = require('express');
const crypto = require('crypto');
const list = require('./list');
const DEFAULT_HASH = 'sha1';
const app = express();

let currentQueues = {};

function getHash(hash_name, value) {
    return crypto.createHash(hash_name).update(value).digest('hex');
};

function generateList(queue_list) {
    return queue_list.map(name => [getHash(DEFAULT_HASH, name), name])
        .sort((a, b)=>a[0] - b[0])
        .map((node, i) => [i + 1, [...node]])
};

for (let queue_name of Object.keys(list)) {
    currentQueues[queue_name] = generateList(list[queue_name]);
}

let fs = require('fs');

(async () => {
    await new Promise(res => {
        fs.writeFile('queues.json', JSON.stringify(currentQueues, null, 4), res);
    });

    app.get('/', (req, res) => {
        res.send(currentQueues);
    });

    app.listen(12000, () => { });
})();

