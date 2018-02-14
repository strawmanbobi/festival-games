## Dummy Engine

#### prerequisites

node.js (ver6.0 above)

mongo DB (ver3.4 above)

#### install dependencies

    npm install -g bower
    npm install
    
    cd to web/<some-game>/js/public
    bower install

#### create DB

run mongo client and grant permission to user

    use festival;
    db.createUser(
    {
        user: "admin",
        pwd: "123456",
        roles: [
           { role: "readWrite", db: "festival" }
        ]
    });

#### create temp file folders under /data/game in Linux

#### to start

    node festival-games.js


