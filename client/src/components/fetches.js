const domain = !process.env.NODE_ENV || process.env.NODE_ENV === 'development'
  || process.env.NODE_ENV === 'test' ? 'http://localhost:5001' : '';

async function addFollow(user0, user1) {
  const res = await fetch(`${domain}/api/follows`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user0,
      user1,
    }),
  });
  return res.json();
}

async function addBlock(user0, user1) {
  const res = await fetch(`${domain}/api/blocks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user0,
      user1,
    }),
  });
  return res.json();
}

async function deleteFollow(user0, user1) {
  const res = await fetch(`${domain}/api/follows`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user0,
      user1,
    }),
  });
  return res.json();
}

async function deleteBlock(user0, user1) {
  const res = await fetch(`${domain}/api/blocks`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user0,
      user1,
    }),
  });
  return res.json();
}

async function getFollowing(id) {
  const res = await fetch(`${domain}/api/following/${id}`);
  return res.json();
}

async function getBlocking(id) {
  const res = await fetch(`${domain}/api/blocking/${id}`);
  return res.json();
}

async function getUserByName(name) {
  const res = await fetch(`${domain}/api/user/${name}`);
  return res.json();
}

async function resetPassword(username, email, password) {
  const res = await fetch(`${domain}/api/user/${username}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
  return res.json();
}

async function createPost(userid, content) {
  const res = await fetch(`${domain}/api/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userid,
      content,
    }),
  });
  return res.json();
}

async function getPosts() {
  const res = await fetch(`${domain}/api/posts`);
  return res.json();
}

async function getPostsByUser(id) {
  const posts = await fetch(`${domain}/api/posts-by-user/${id}`);
  return posts.json();
}

async function getFeed(id) {
  const posts = await fetch(`${domain}/api/feed/${id}`);
  return posts.json();
}

async function hidePost(userid, postid) {
  const res = await fetch(`${domain}/api/hide`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userid,
      postid,
    }),
  });
  return res.json();
}

async function deletePost(postid) {
  const res = await fetch(`${domain}/api/post/${postid}`, {
    method: 'DELETE',
  });
  return res.json();
}

async function deactivate(username) {
  const res = await fetch(`${domain}/api/user/${username}/is_active`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      is_active: false,
    }),
  });
  return res.json();
}

async function login(username, password) {
  const res = await fetch(`${domain}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
    }),
  });
  return res.json();
}

async function register(username, password, email, nickname, avatarRef) {
  let nicknameOverride = nickname;
  if (nickname === '') {
    nicknameOverride = username;
  }
  const res = await fetch(`${domain}/api/user`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username,
      password,
      email,
      nickname: nicknameOverride,
      avatar_ref: avatarRef,
    }),
  });
  return res.json();
}

async function comment(ownerid, postid, replyingTo, content) {
  const res = await fetch(`${domain}/api/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ownerid,
      postid,
      content,
      replyingTo,
    }),
  });
  return res.json();
}

async function getCommentsByPost(postid) {
  const res = await fetch(`${domain}/api/comments-by-post/${postid}`);
  return res.json();
}

async function deleteComment(id) {
  const res = await fetch(`${domain}/api/comment/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}

export default {
  addFollow,
  addBlock,
  deleteFollow,
  deleteBlock,
  getFollowing,
  getBlocking,
  getUserByName,
  resetPassword,
  createPost,
  getPosts,
  getPostsByUser,
  getFeed,
  hidePost,
  deletePost,
  deactivate,
  login,
  register,
  comment,
  getCommentsByPost,
  deleteComment,
};
