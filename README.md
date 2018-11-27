# Python Web Editor
## yeah there's already a million of 'em, but this one is _ours_

## Install / Run Instructions (Mac)

### from `src/client` directory:

1. `npm install`
2. `npm run start`

### Install + Run MongoDB

1. `brew install mongodb`
2. `mkdir -p /data/db`
3. `sudo chown -R `id -un` /data/db`
4. `mongod`

### from `src/server` directory in separate terminal window

1. `virtualenv webeditorenv`
2. `source webeditorenv/bin/activate`
3. `pip install -r requirements.txt`
2. `python WebServer.py 1234`
4. navigate to `localhost:8080` in your browser

# Shameless Plug
## Authors:
    
* [Adrian Preston](https://www.linkedin.com/in/adrian-preston/ "Baws Man McGhee") 
* [Elyes Graba](https://www.linkedin.com/in/elyes-graba "The prime suktemous")