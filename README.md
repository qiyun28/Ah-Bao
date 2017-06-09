# Ah-Bao
A [Phaser.js](https://phaser.io/) game made for fun  


### Developer set up guide (offline environment: Phaser + Grunt + grunt-connect)
- install [Node](https://nodejs.org/en/) and NPM
- install Grunt CLI globally:
    ```sh
    $ npm install -g grunt-cli
    ```
- create *package.json*
- install Grunt for Ah-Bao project. Go to *An-Bao* folder and type the following at the prompt:
    ```sh
    $ npm install grunt --save-dev
    ```
- install plugin Connect to serve local files
    ```sh
    $ npm install grunt-connect --save-dev
    ```
- create *Gruntfile.js*
- run the server
    ```sh
    $ grunt connect
    ```
- open http://localhost:1337/index.html in browser

Note: We use CDN for Phaser


### License
GPL-3.0
