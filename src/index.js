import initModel from './Model';
import update from './Update';
import view from './View';
import app from './App';
import config from './Config';
// import promise from './Openweather';

const node = document.getElementById('app');

app(initModel, update, view, node);
