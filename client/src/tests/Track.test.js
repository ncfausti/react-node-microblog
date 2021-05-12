/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import Track from '../components/Track';

test('Page matches snapshot', () => {
  const component = renderer.create(
    <Track track={null} />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
