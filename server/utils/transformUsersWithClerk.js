import { clerkClient } from "../index.js";

export default async function transformUsersWithClerk(user) {
  let connections = [];
  let requests = [];

  if (user.connections.length > 0) {
    connections = (
      await clerkClient.users.getUserList({ userId: user.connections })
    ).data;
    connections = connections.map((connection) => {
      return {
        id: connection.id,
        image: connection.imageUrl,
        name: `${connection.firstName} ${connection.lastName}`,
      };
    });
  }

  if (user.requests.length > 0) {
    requests = (await clerkClient.users.getUserList({ userId: user.requests }))
      .data;
    requests = requests.map((request) => {
      return {
        id: request.id,
        image: request.imageUrl,
        name: `${request.firstName} ${request.lastName}`,
      };
    });
  }

  user = {
    ...user.toObject(),
    connections,
    requests,
  };

  return user;
}
