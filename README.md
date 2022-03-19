# ticket-system
NUS IT5007 Tutorial Practice

Link to my GitHub repo: [https://github.com/viridityzhu/ticket-system](https://github.com/viridityzhu/ticket-system)

## Commands

### Git clone this repo

```sh
git clone git@github.com:viridityzhu/ticket-system.git
cd ticket-system
git checkout tut4
```

### Install

(Optional) Install nvm, npm, and express
```sh
nvm install 10
nvm alias default 10
npm install -g npm@6
npm install express
```

Install modules
```sh
npm install

npm install --save-dev @babel/core@7 @babel/cli@7
npm install --save-dev @babel/preset-react@7
```

### Initialize

```sh
node scripts/trymongo.js
mongo ticketsys scripts/init.mongo.js
```

### Compile

```sh
npm run compile
```

### Start

```sh
screen mongod
<C-a> d
npm start
```

Visit [http://localhost:3000](http://localhost:3000)