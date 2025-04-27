Script, that allows to make and place on your machine YML Feeds
from fetching the WC Stores API

How to install
git clone [link to this repo]
npm install

~optional:
change path to output directories in conf.ts file

fill create .env file and fill it
npm run start <-- for first time. Once its builded --> node build/index.js

.env file should be placed in cloned repo dir.
It contains some WC Store credentials in form like

    store_url=''
    store_wcKey=''
    store_wcSecret=''
