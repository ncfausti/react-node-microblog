/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import ResetPassword from '../components/reset_password';

test('Page matches snapshot', () => {
  const component = renderer.create(
    <ResetPassword.WrappedComponent />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
