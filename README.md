# Cats and Dogs classification with image upload

# explanation

- The Frontend is ReactJS in the frontend directory see `./frontend/src/App.js`
- Backend is using Nodejs Express server that calls Python Script in a miniconda environment
Backend is in `./app.js` and 'ai' file is located in `./catsanddogs.py`
(no Python Django for now, because I prefer nodejs)

# list of important files

- `catsanddogs.py` the 'ai' python script
- `model.h5` the ai graphs weights in binary representation
- `model.json` the ai keras model in json format
- `app.js` the node backend, upload and shell run of the python script
- `./frontend/src/App.js` - The ReactJS main frontend
- `./frontend/src/App.css` - here, the frontend styles are defined

# prerequisites

- Have nodejs & python with miniconda & tensorflow including keras installed
- Miniconda installation on Mac M1: https://www.youtube.com/watch?v=o4-bI_iZKPA
- Miniconda installation Ubuntu: https://www.youtube.com/watch?v=dj-Jntz-74g&t=339s
- Jupyter isn't needed on server, you can skip these commands

# conda installation on ubuntu

- on M1 Macos run with `conda activate tensorflow`
have miniconda installed first (check jeff heaton clip on the installation) with env tensorflow, then do a `node app.js` to run the application locally on mac e.g. first change URI path in `./frontend/src/App.js` to get it running locally
- install miniconda arch64 for arm ubuntu (for intel this doesn't work! choose the suiting installer script): https://docs.conda.io/projects/miniconda/en/latest/
- to get ubuntu installation file run `wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh` then `chmod +x` this file and run it as sudo, this is explained in the video clip listed above.
- see https://github.com/jeffheaton/t81_558_deep_learning/blob/master/install/tensorflow-install-jul-2020.ipynb for the needed commands
- (optional) conda addons on server do a `wget https://raw.githubusercontent.com/jeffheaton/t81_558_deep_learning/master/tools.yml`

# conda commands to get tensorflow running on ubuntu, try:

- once conda script has installed conda
- `conda install -c conda-forge tensorflow`
- you cann install tensorflow via calling `conda install tensorflow` and `conda install pip` eventually `conda install pillow`
- `pip install pillow` with pip installed via conda e.g. (pip is the python package manager)
- `conda env update --file tools.yml` with tools.yml (optional) from `_Project` folder in this repository 

# to test if tensorflow is installed on ubuntu do a

- `cd ./_Project && python check.py`

# build

- Frontend: `cd frontend && npm install && npm run build` alternatively run `yarn` instead of npm install
- Backend in current directory run a `npm install` or alternatively run `yarn`
- you must do a `mkdir uploads` in the root directory (this is the folder where the uploaded images are stored)
- in `./frontend/src/App.js` you must change:
- `const endpointURI = 'http://keepitnative.xyz:5000';` 
- to sth. that suits your server: `const endpointURI = 'http://localhost:8080';` and run 
`npm run build` again in the frontend directory

# .env file

- you must create a `.env` file (rename e.g, .env-production into .env) in this directory with content like `NODE_ENV=development` or `NODE_ENV=production` use production on a linux server

# run

- run frontend standalone just for test pre running: `cd frontend && npm start` press `Ctrl + C` to stop / kill process, first in order to use forever


- install forever nodejs to run whole app in background `npm install forever -g`
- run backend in background:  `forever start app.js`
- run `forever list` to get the id of the background process
- run without sudo `forever stop 0` or whatever id instead of `0`

# call in a webbrowser

- call `http://localhost:8080` locally
- on server call: `http://your-ip:5000`

# demo

- http://keepitnative.xyz:5000
