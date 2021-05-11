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

async function createPost(userid, content, media) {
  const res = await fetch(`${domain}/api/post`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userid,
      content,
      media,
    }),
  });
  return res.json();
}

async function getPosts(page = 1) {
  const res = await fetch(`${domain}/api/posts?page=${page}`);
  return res.json();
}

async function getPostsByUser(id, page = 1) {
  const posts = await fetch(`${domain}/api/posts-by-user/${id}?page=${page}`);
  return posts.json();
}

async function getFeed(id, page = 1) {
  const posts = await fetch(`${domain}/api/feed/${id}?page=${page}`);
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

async function register(username, password, email, nickname, avatarRef, summary) {
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
      avatarRef,
      summary,
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

async function getMessages(username) {
  const res = await fetch(`${domain}/api/messages/${username}`, {
    method: 'GET',
  });
  return res.json();
}

async function getSentMessages(username) {
  const res = await fetch(`${domain}/api/sentMessages/${username}`, {
    method: 'GET',
  });
  return res.json();
}

async function publishMessage(srcUser, dstUser, text, audio, video, image) {
  const formData = new FormData();
  formData.append('srcUser', srcUser);
  formData.append('dstUser', dstUser);
  if (text) {
    formData.append('text', text);
  } else if (audio) {
    formData.append('audio', audio);
  } else if (video) {
    formData.append('video', video);
  } else if (image) {
    formData.append('image', image);
  }

  const res = await fetch(`${domain}/api/message`, {
    method: 'POST',
    body: formData,
  });
  return res.json();
}

async function getUsers() {
  const res = await fetch(`${domain}/api/users`);
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
  getMessages,
  publishMessage,
  getUsers,
  getSentMessages,
};
