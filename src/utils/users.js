const users = [];

// adduser , removeuser , getuser , getusers in room

const addUser = ({id,username,room }) => {
  // clean data
  username = username
  room=room
  // validate
  if (!username || !room) {
    return {
      error: " Input missiong! ",
    };
  }
  // check for existing user
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  // validate user
  if (existingUser) {
    return {
      error: " Account already in use ",
    };
  }

  //store user
  const user = { id, username, room };
  users.push(user);
  return { user };
};


const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id); // find by index
  if (index !== -1) {
    return users.splice(index, 1)[0];   // remove items by index
  }
};

const getUser = (id) => {
  return users.find((user) => user.id === id);
};


const getUsersInRoom = (room) => {
  return users.filter((user) => user.room === room);
};


module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
};