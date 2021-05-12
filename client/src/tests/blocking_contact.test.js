/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import {
  fireEvent, render, waitFor,
} from '@testing-library/react';
import BlockingContact from '../components/home/blocking_contact';

test('test button click', async () => {
  const mock = jest.fn().mockImplementation(() => {});
  const { getByRole } = render(<BlockingContact username='feng' userid={31} unblock={mock}/>);
  fireEvent.click(getByRole('button', { name: 'Unblock' }));
  await waitFor(() => {
    expect(mock).toHaveBeenCalled();
  });
});

test('Page matches snapshot', () => {
  const component = renderer.create(<BlockingContact username='feng' userid={31}/>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
