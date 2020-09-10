import * as R from 'ramda';
import config from './Config';

const MSGS = {
  GET_LOCATION: 'GET_LOCATION',
  ADD_LOCATION: 'ADD_LOCATION',
  DELETE_LOCATION: 'DELETE_LOCATION',
  HTTP_SUCCESS: 'HTTP_SUCCESS',
}

const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

function weatherUrl(city) {
    return `${API_URL}?q=${encodeURI(
        city,
        )}&units=imperial&APPID=${config.apiKey}`;
}

export function getLocation(location) {
  return {
    type: MSGS.GET_LOCATION,
    location,
  }
}

export const addLocation = { type: MSGS.ADD_LOCATION };

export function deleteLocation(id) {
  return {
    type: MSGS.DELETE_LOCATION,
    id,
  }
}

const httpSuccessMsg = R.curry((id, response) => ({
  type: MSGS.HTTP_SUCCESS,
  id,
  response,
}));


function update(msg, model) {
  switch (msg.type) {
    case MSGS.GET_LOCATION: {
      const { location } = msg;
      return { ...model, location }
    }
    case MSGS.ADD_LOCATION: {
      const { location, nextId, weathers } = model;
      const newWeather = {
        id: nextId,
        location: location,
        temp: '?',
        low: '?',
        high: '?',
      };
      const updatedWeathers = R.prepend(newWeather, weathers);
      return [{
          ...model,
          location: '',
          weathers: updatedWeathers,
          nextId: nextId + 1,
        },
        {
          request: { url: weatherUrl(location) },
          successMsg: httpSuccessMsg(nextId),
        }
      ]
    }
    case MSGS.DELETE_LOCATION: {
      const { id } = msg;
      const newWeathers = R.filter(n => n.id !== id, model.weathers)
      return {
        ...model,
        weathers: newWeathers,
      }
    }
    case MSGS.HTTP_SUCCESS: {
      const { id, response } = msg;
      const { weathers } = model;
      const { temp, temp_min, temp_max } = R.pathOr(
        {},
        ['data', 'main'],
        response,
      );
      const updatedWeathers = R.map(weather => {
        if(weather.id === id) {
          return {
            ...weather,
            temp: Math.round(temp),
            low: Math.round(temp_min),
            high: Math.round(temp_max),
          }
        }
        return weather;
      }, weathers);
      return {
        ...model,
        weathers: updatedWeathers,

      }
    }
  }
}

export default update;
