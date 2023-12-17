# Cats and Dogs classification with image upload

# explanation

- The frontend is made in ReactJS and is located in the frontend directory, please check `./frontend/src/App.js`
- Backend is using nodejs express server that calls python script in a miniconda environment
- Backend is in `./app.js` and 'ai' file is located in `./catsanddogs.py`
(no Python Django for now, because the rest of the webspace is mainly built with nodejs)

# list of important files

- `catsanddogs.py` the 'ai' python script
- `model.h5` the ai graphs weights in binary representation
- `model.json` the ai keras model in json format
- `app.js` the node backend, upload and shell run of the python script
- `./frontend/src/App.js` - The ReactJS main frontend
- `./frontend/src/App.css` - here, the frontend styles are defined

# prerequisites

- First have nodejs & python with miniconda & tensorflow including keras installed
- Miniconda installation on Mac M1: https://www.youtube.com/watch?v=o4-bI_iZKPA
- Miniconda installation Ubuntu: https://www.youtube.com/watch?v=dj-Jntz-74g&t=339s
- Jupyter isn't needed on server, you can skip these commands

# conda installation on ubuntu

- have miniconda installed first (check jeff heaton clip on the installation) with env tensorflow.
- If you have an ARM processor e.g. install miniconda arch64 for arm ubuntu. For intel based machines this doesn't work! choose the suiting installer script on the following page: https://docs.conda.io/projects/miniconda/en/latest/
- to get ubuntu installation file when having an ARM machine, run `wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh` (for intel wget the corresponding installer script, chmod it & run it) then `chmod +x` this file and run it as sudo, this is explained in the video clip listed above.
- see https://github.com/jeffheaton/t81_558_deep_learning/blob/master/install/tensorflow-install-jul-2020.ipynb for the needed commands
- (optional) conda addons on server do a `wget https://raw.githubusercontent.com/jeffheaton/t81_558_deep_learning/master/tools.yml`
On M1 Macos run Python tensorflow script in a terminal with `conda activate tensorflow`.

# conda commands to get tensorflow running on ubuntu:

- once conda script has installed conda
- `conda install -c conda-forge tensorflow`
- you can install tensorflow via calling `conda install tensorflow` and `conda install pip` eventually `conda install pillow`
- `pip install pillow` with pip installed via conda e.g. (pip is the python package manager)
- `conda env update --file tools.yml` with tools.yml (optional) from `_Project` folder in this repository 

# to test if tensorflow is installed on ubuntu do a

- `cd ./_Project && python check.py`

# build

- Frontend: You must install the dependencies and then make a build of the reactjs app. But first change URI.
- in `./frontend/src/App.js` you must change:
- `const endpointURI = 'http://keepitnative.xyz:5000';` 
- to sth. that suits your server: `const endpointURI = 'http://localhost:8080';` 
- then build frontend by doing a `npm run build`.
- `cd frontend && npm install && npm run build` alternatively run `yarn` instead of npm install
- Backend in current directory run a `npm install` or alternatively run `yarn`
- you must do a `mkdir uploads` in the root directory (this is the folder where the uploaded images are temporarly stored)

# .env file

- you must create a `.env` file (rename e.g, .env-production into .env) in this directory with content like `NODE_ENV=development` or `NODE_ENV=production` use production on a linux server and set `PORT=5000` or `PORT=8080` in the .env file!

# run

- (optionally for test) run frontend standalone just for test pre running: `cd frontend && npm start` press `Ctrl + C` to stop / kill process, first in order to use forever
- install forever nodejs to run whole app in background `npm install forever -g`
- run backend in background:  `forever start app.js`
- run `forever list` to get the id of the background process
- run without sudo `forever stop 0` or whatever id instead of `0` to kill the process in order to change sth.

# call in a webbrowser

- call `http://localhost:8080` locally
- on server call: `http://your-ip:5000`

# demo

- http://keepitnative.xyz:5000
