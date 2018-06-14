let express = require('express');
let crypto = require('crypto');
const list = require('./list');
const DEFAULT_HASH = 'sha1';
let app = express();

let current_queues = {};

let get_hash = (hash_name, value) => {
    return crypto.createHash(hash_name).update(value).digest('hex');
};

let generate_list = (queue_list) => {
    return queue_list.map(name => [get_hash(DEFAULT_HASH, name), name])
        .sort(function(a, b){
            if(a[0] < b[0]) return -1;
            if(a[0] > b[0]) return 1;
            return 0;
        })
        .map((node, i) => [i+1, [...node]])
};

for (let queue_name of Object.keys(list)) {
    current_queues[queue_name] = generate_list(list[queue_name]);
}

let fs = require('fs');
fs.writeFile('queues.json', JSON.stringify(current_queues, null, 4));


app.get('/', function (req, res) {
    res.send(current_queues);
});

app.listen(12000, function () {
});


