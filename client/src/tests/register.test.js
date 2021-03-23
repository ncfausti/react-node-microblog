/* eslint-disable no-undef */
import React from 'react';
import {
  fireEvent, render, waitFor, screen,
} from '@testing-library/react';
import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import fetchMock from 'jest-fetch-mock';
import Register from '../components/register';

fetchMock.enableMocks();

describe('webpage correctly handles submit & shows msg from server', () => {
  test('display error msg when server rejects this registration', async () => {
    fetch.mockResponseOnce(JSON.stringify({
      status: 'err',
      msg: '✖ Registration failed: Invalid username or password provided.',
    }));

    const { getByRole } = render(<Register.WrappedComponent/>);
    fireEvent.click(getByRole('button', { name: 'Register' }));

    await waitFor(() => {
      expect(screen.getByText('✖ Registration failed: Invalid username or password provided.')).toBeInTheDocument();
    });
  });
});
