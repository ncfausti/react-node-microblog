/* eslint-disable no-undef */
import React from 'react';
import renderer from 'react-test-renderer';
import Comment from '../components/comment';

test('Page matches snapshot', () => {
  const component = renderer.create(
    <Comment
      commentid={1}
      userid={31}
      avatar_ref={'https://wallpaperaccess.com/full/2213448.jpg'}
      username={'feng3116'}
      nickname={'Feng'}
      creation_date={'4/27/2021, 8:27:30 AM'}
      content={'test comment'}
      replying_to={'feng3116'}
      changeReplyingto={undefined}
      viewerid={31}
      delete={undefined}
    />,
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
