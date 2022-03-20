# ticket-system
NUS IT5007 Tutorial Practice

**For Tutorial 4: switch to branch `tut4`**

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

### Initialize && Test

Start Mongo server:
```sh
screen mongod
<C-a> d
```
Test all CRUD operations:
```sh
node scripts/trymongo.js
```

Initialize Mongo db:
```sh
mongo ticketsys scripts/init.mongo.js
```
### Compile

```sh
npm run compile
```

### Start

```sh
npm start
```

Visit [http://localhost:3000](http://localhost:3000)