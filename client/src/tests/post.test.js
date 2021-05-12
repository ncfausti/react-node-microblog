/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import '@testing-library/jest-dom';
import 'isomorphic-fetch';
import fetchMock from 'jest-fetch-mock';
import Post from '../components/post';

fetchMock.enableMocks();

test('Page matches snapshot', () => {
  fetch.mockResponses(JSON.stringify([{
    commentid: 1,
    userid: 31,
    avatar_ref: 'https://wallpaperaccess.com/full/2213448.jpg',
    username: 'feng3116',
    nickname: 'Feng',
    creation_date: '2021-04-27 12:26:23',
    content: 'test comment',
    replying_to: 'feng3116',
  }]), JSON.stringify([{
    username: 'test',
  }]));
  const component = renderer.create(
    <Post
      avatar_ref={'https://wallpaperaccess.com/full/2213448.jpg'}
      nickname={'Feng'}
      username={'feng3116'}
      content={'Hey there!'}
      date={'4/27/2021, 8:27:30 AM'}
      postid={1}
      viewerid={31}
      ownerid={31}
      currentuser_avatar_ref={'https://wallpaperaccess.com/full/2213448.jpg'}
      hide={undefined}
      delete={undefined}
      media={null}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
