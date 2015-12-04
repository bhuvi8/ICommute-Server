# README #

**ICommute** - An application to track organizational vehicles and send updates to users about detailed route,location and time information.

### What is this repository for? ###

* This repository contains the server side of the application
* 0.0.1


### How to run the program ? ###
 Download the code and run below commands to run the server application 

```
#!shell

  git clone [git url]
  cd app-name/
  npm install
  nodejs server.js
```

#### Configuration ####
  Edit the config.js file in the applications root directory to modify server configuration such as to set the interface and port number for the server to run on
  
#### Dependencies ####
To run this application you need to have following packages installed

    * nodejs
    * mongodb
Nodejs modules required

    1. express
    2. mongodb
    3. checksum
  Nodejs module dependencies are specified in package.json file and running npm install in application directory after nodejs is installed will install all the required modules automatically.

#### Database configuration ####
  Database used is mongodb and it does not need any special configuration if the database is running in the same machine as this server and default port is not modified.
  If mongodb is running in a different host or a different port other than the default, just set the config properties config.db_server and config.db_port in config.js to appropriate values.

### Contribution guidelines ###

* contributions are always welcome. To contribute just fork the repository and implement the features you wish to see or do some bug fixes and send back a pull request.

### License terms ###
* This code is licensed under **GNU GPLv3**. See License.txt file included for more details.