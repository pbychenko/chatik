import React from 'react';
import {
  ListGroup,
} from 'react-bootstrap';

const Users = (props) => {
  // const { selectedChannel, channels, selectChannel } = props;
  const { selectUser, users, selectedUser } = props;

  return (
      <ListGroup variant="flush">
        Users Online
        {users.map((user) => (
          <ListGroup.Item
              key={user.id}
              style={{ wordWrap: 'break-word', textAlign: 'left' }}
              onClick={selectUser(user.id)}
              className={ user.id === selectedUser ? 'active' : null}
              >
              {user.name}</ListGroup.Item>))}
          </ListGroup>);
};

export default Users;
