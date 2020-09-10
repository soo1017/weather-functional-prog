import * as R from 'ramda';
import hh from 'hyperscript-helpers';
import { h } from 'virtual-dom';
import {
  getLocation,
  addLocation,
  deleteLocation,
} from './Update';

const { div, h1, pre, label, input, button, form, li, ul, i } = hh(h);

function inputField(labelText, value, oninput) {
  return [
    label({ className: 'f6 b db mb2'}, labelText),
    input({ 
      className: 'pa2 w-60',
      type: 'text',
      value,
      oninput,
    }),
  ]
}

function buttonField(name, onclick) {
  return button({ 
    className: 'pv2 ml1 ph3 br1',
    type: 'submit',
    onclick,
  }, name)
}

function addFormSet(dispatch, model) {
  return div({ className: '' },
    form({ className: '' }, 
      [
        inputField('Location', model.location, 
          e => dispatch(getLocation(e.target.value))
        ),
        buttonField('Add', (e) => {
          e.preventDefault();
          return dispatch(addLocation)
        }),
      ]
    ),
  )
}

function oneLocationSet(weather) {
  return div({ className: 'w-60 tl'}, [
    div({ className: 'f7 b'}, 'Location'),
    div({ className: ''}, weather.location),
  ])
}

function oneTempSet(weather) {
  return div({ className: 'w-10 tc'}, [
    div({ className: 'f7 b'}, 'Temp'),
    div({ className: ''}, weather.temp),
  ])
}

function oneLowSet(weather) {
  return div({ className: 'w-10 tc'}, [
    div({ className: 'f7 b'}, 'Low'),
    div({ className: ''}, weather.low),
  ])
}

function oneHighSet(weather) {
  return div({ className: 'w-10 tc mr2'}, [
    div({ className: 'f7 b'}, 'High'),
    div({ className: ''}, weather.high),
  ])
}

function oneWeatherSet(dispatch, weather) {
  return li({ className: 'pa3 bb b--light-silver flex justify-between relative' }, [
    oneLocationSet(weather),
    oneTempSet(weather),
    oneLowSet(weather),
    oneHighSet(weather),
    i({ 
      className: 'relative top--1 right--1 mt1 mr1 fa fa-remove pointer black-40',
      onclick: () => dispatch(deleteLocation(weather.id)),
    }),
  ])
}

function weatherListsSet(dispatch, weathers) {
  if (weathers.length) {
    return ul({ className: 'list pl0 ml0 ba b--light-silver br' }, 
      R.map(n => oneWeatherSet(dispatch, n), weathers),
    )
  } else {
    return ;
  }
}

function view(dispatch, model) {
  return div({ className: 'mw6 center' }, [
    h1({ className: 'f2 pv2 bb' }, 'Weather'),
    addFormSet(dispatch, model),
    weatherListsSet(dispatch, model.weathers),
  ]);
}

export default view;
