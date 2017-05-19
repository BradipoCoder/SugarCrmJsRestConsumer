/**
 * Created by jack on 19/05/17.
 */
//var Promise = require("bluebird");

var sugar = require('./lib/main');

console.log("initing...");
sugar.init('http://gsi.crm.mekit.it', 'v4_1', 'user1', 'user1');


sugar.authenticate()
    .then(function()
    {
        console.log("Auth ok");
    })
    .catch(function(error)
    {
        console.error(error);
    });

