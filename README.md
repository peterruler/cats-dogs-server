# Cats and Dogs classification with image upload

- Frontend is static compiled ReactJS Frontend
- Backend is using Nodejs Express server that calls Python Script in a miniconda environment (no Python Django for now, because I prefer nodejs)

- on M1 Macos run with `conda activate tensorflow`
have miniconda installed first (check jeff heaton clip on my installation) with env tensorflow, then do a `node app.js` to run the application locally on mac e.g.

# prerequisites

- Have nodejs & python with miniconda & tensorflow  & keras installed
- Miniconda installation on Mac M1: https://www.youtube.com/watch?v=o4-bI_iZKPA
- Miniconda installation Ubuntu: https://www.youtube.com/watch?v=dj-Jntz-74g&t=339s
- Jupyter isnt needed on server, you can skip this commands

# conda commands the get tensorflow running on ubuntu, try:
- once conca script has installed conda
- `conda install -c conda-forge tensorflow`
- `pip install pillow`
- `conda env update --file tools.yml` with tools.yml (optional) from `_Project` folder in this repository 

# to test if tensorflow is installed on ubuntu do a

- `cd ./_Project && python check.py`

# build

- Frontend: `cd frontend && npm install && npm run build` alternative run `yarn`

- Backend in current directory run a `npm install` or alternatively run `yarn`

# .env file
- you must create a `.env` file in this directory with content like `NODE_ENV=development` or `NODE_ENV=production` use production on a linux server

# run

- run frontend standalone just for test pre running: `cd frontend && npm start` press `Ctrl + C` to stop / kill process


- install forever nodejs to run whole app in background `npm install forever -g`
- run backend in background:  `forever start app.js`
- run `forever list``
- run without sudo `forever stop 0` or whatever id instead of `0`

- install miniconda ach64 for arm ubuntu: https://docs.conda.io/projects/miniconda/en/latest/

- to get ubuntu installation file run `wget https://repo.anaconda.com/miniconda/Miniconda3-latest-Linux-aarch64.sh`then `chmod +x`` this file and run it as sudo, this is explained in the video clip listed above.

- see https://github.com/jeffheaton/t81_558_deep_learning/blob/master/install/tensorflow-install-jul-2020.ipynb for the needed commands

- (optional) conda addons on server do a `wget https://raw.githubusercontent.com/jeffheaton/t81_558_deep_learning/master/tools.yml`

# run
- call `http://localhost:8080` locally
- on server call: `http://your-ip:5000`
