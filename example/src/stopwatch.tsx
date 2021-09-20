import * as React from 'react';
import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { StopwatchStore } from './stopwatch-store';
import { FormStore } from './form-store';

export const Stopwatch = observer(() => {
  const [stopwatch] = useState(() => new StopwatchStore());
  const [form] = useState(() => {
    return new FormStore({
      count: stopwatch.count,
      tickSpeed: stopwatch.tickSpeed,
      step: stopwatch.step,
    });
  });

  return (
    <div className="body">
      <div id="counter">{stopwatch.count}</div>
      <div id="controls">
        <fieldset>
          <legend>Setup</legend>
          <button
            id="start"
            disabled={stopwatch.isTicking}
            onClick={() => stopwatch.start()}
          >
            start
          </button>
          <button id="pause" onClick={() => stopwatch.pause()}>
            pause
          </button>
          <button id="reset" onClick={() => stopwatch.reset()}>
            reset
          </button>
        </fieldset>
        <fieldset>
          <legend>Count</legend>
          <button id="countup" onClick={() => stopwatch.setCountUp(true)}>
            count up
          </button>
          <button id="countdown" onClick={() => stopwatch.setCountUp(false)}>
            count down
          </button>
        </fieldset>
        <fieldset>
          <legend>Set to</legend>
          <input id="value" {...form.getField('count')} />
          <br />
          <button
            id="setto"
            onClick={() => {
              stopwatch.setCount(form.getField('count').value);
            }}
          >
            set value
          </button>
        </fieldset>
        <fieldset>
          <legend>Speed ms.</legend>
          <input id="speed" {...form.getField('tickSpeed')} />
          <br />
          <button
            id="setspeed"
            onClick={() => {
              stopwatch.setTickSpeed(form.getField('tickSpeed').value);
            }}
          >
            set speed
          </button>
        </fieldset>
        <fieldset>
          <legend>Step</legend>
          <input {...form.getField('step')} />
          <br />
          <button
            onClick={() => {
              stopwatch.setDiff(form.getField('step').value);
            }}
          >
            set step
          </button>
        </fieldset>
      </div>
    </div>
  );
});