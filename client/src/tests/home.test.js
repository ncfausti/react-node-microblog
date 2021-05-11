/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import Home from '../components/home';

const intersectionObserverMock = () => ({
  observe: () => null,
});
window.IntersectionObserver = jest.fn().mockImplementation(intersectionObserverMock);

const mockRouterProps = { state: { username: 'feng3116' } };

test('Page matches snapshot', () => {
  const component = renderer.create(<Home.WrappedComponent location={mockRouterProps} />);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
