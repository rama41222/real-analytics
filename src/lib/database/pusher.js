const Pusher = require('pusher');
const { pusher_keys } = require('./../config');
//create a instance of pusher using your credentials
const pusher = new Pusher({
  appId: pusher_keys.app_id,
  key: pusher_keys.key,
  secret: pusher_keys.secret,
  cluster: pusher_keys.cluster,
  encrypted: true
});

console.log(pusher, pusher_keys)

module.exports = pusher;
