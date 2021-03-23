// Link.react.test.js
import React from 'react';
import renderer from 'react-test-renderer';
import LoginWithRouter from '../components/login';

test('Link changes the class when hovered', () => {
  const component = renderer.create(
    <LoginWithRouter/>,
  );
  let tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseEnter();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();

  // manually trigger the callback
  tree.props.onMouseLeave();
  // re-rendering
  tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});