let express = require('express');
let crypto = require('crypto');
const list = require('./list');
const DEFAULT_HASH = 'md5';
let app = express();

let get_hash = (hashname, value) => {
    return crypto.createHash(hashname).update(value).digest('hex');
};

let generate_list = (list) => {
    return list.map(name => [get_hash(DEFAULT_HASH, name), name])
        .sort((a, b) => a[0] > b[0])
        .map(node => node[1])
};

let generated_list = generate_list(list);

for (const name of generated_list) console.log(name);

