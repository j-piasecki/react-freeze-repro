import React, {useEffect} from 'react';
import {Freeze} from 'react-freeze';

const listeners = [];

function addListener(listener) {
  listeners.push(listener);

  return () => {
    const index = listeners.indexOf(listener);
    listeners.splice(index, 1);
  };
}

let test = true;

function ComponentWithLayout() {
  const [a, setA] = React.useState(0);

  React.useEffect(() => {
    console.log('Test Mount');

    return () => {
      console.log('Test Unmount');
    };
  }, []);
  console.log('Test render');

  if (test) {
    queueMicrotask(() => {
      console.log('Test sdfasdfasdf');
      setA(1);
    })
    test = false;
  }

  return (
    <div
      style={{width: 100, height: 100, backgroundColor: 'blue'}}
    >
      <span>{a}</span>
    </div>
  );
}

function DelayedRender(props) {
  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    console.log('DelayedRender immediate');
    setVisible(true);

    listeners.forEach(listener => listener());
  }, []);

  if (visible) {
    console.log('DelayedRender done');
    return props.children;
  } else {
    console.log('DelayedRender waiting');
    return null;
  }
}

function FreezeComponent({frozen}) {
  return (
    <div style={{width: 100, height: 100}}>
      <Freeze freeze={frozen}>
        <div style={{width: 100, height: 100, backgroundColor: 'red'}} />
      </Freeze>
    </div>
  );
}

function DelayedComponent({visible}) {
  return (
    <div style={{width: 100, height: 100}}>
      {visible && (
        <DelayedRender>
          <ComponentWithLayout />
        </DelayedRender>
      )}
    </div>
  );
}

function FreezeTest() {
  const [frozen, setFrozen] = React.useState(false);
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    const unsubscribe = addListener(() => {
      setFrozen(!frozen);
      console.log('freezed:', !frozen);
    });

    return () => {
      unsubscribe();
    };
  }, [frozen]);

  return (
    <div style={{flex: 1}}>
      <div style={{height: 100, flexDirection: 'row'}}>
        <FreezeComponent frozen={frozen} />
        <DelayedComponent visible={visible} />
      </div>

      <input
          type="button"
          value="Do the thing"
          onClick={() => {
            setVisible(!visible);

            if (visible) {
              setFrozen(false);
            }
          }}
        />
    </div>
  );
}

export default FreezeTest;
