/*
    ICommute-server - An application to track organizational transport vehicles
    Copyright (C) 2015  busktimachu

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
    
    server.js : Handles running the http server and routing the requests

*/
var express = require('express');
var engine = require('./routes/app_engine.js');
var config = require('./config');

var app = express();
var host = config.host;
var port = config.port;

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

app.post('/',engine.register);
app.get('/', engine.checkUid);
app.get('/route_map/', engine.sendhash);
app.get('/route_map/download/', engine.Sendfile);

app.listen(config.port, config.host);
console.log('Server running at ip :' + config.host + ' port :' + config.port);

