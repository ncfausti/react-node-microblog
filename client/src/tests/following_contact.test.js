/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import {
  fireEvent, render, waitFor,
} from '@testing-library/react';
import FollowingContact from '../components/home/following_contact';

test('test button click', async () => {
  const mock = jest.fn().mockImplementation(() => {});
  const { getByRole } = render(<FollowingContact username='feng' userid={31} unfollow={mock}/>);
  fireEvent.click(getByRole('button', { name: 'Unfollow' }));
  await waitFor(() => {
    expect(mock).toHaveBeenCalled();
  });
});

test('Page matches snapshot', () => {
  const component = renderer.create(<FollowingContact username='feng' userid={31}/>);
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
