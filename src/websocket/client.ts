import { io } from '../http';
import { ConnectionsServices } from '../services/connectionsServices';
import { MessageServices } from '../services/messageServices';
import { UserServices } from '../services/usersServices';

interface IParams {
  text: string;
  email: string;
}

io.on('connect', (socket) => {
  const connectionService = new ConnectionsServices();
  const usersService = new UserServices();
  const messageServices = new MessageServices();

  socket.on('client_firt_access', async (params) => {
    console.log(params);
    const socket_id = socket.id;
    const { text, email } = params as IParams;
    let user_id = null;

    const userExists = await usersService.findByEmail(email);

    //salvar a conexao
    if (!userExists) {
      const user = await usersService.create(email);

      await connectionService.create({
        socket_id,
        user_id: user.id,
      });

      user_id = user.id;
    } else {
      user_id = userExists.id;
      const connection = await connectionService.findByUserId(userExists.id);

      if (!connection) {
        await connectionService.create({
          socket_id,
          user_id: userExists.id,
        });
      } else {
        connection.socket_id = socket_id;
        await connectionService.create(connection);
      }
    }

    await messageServices.create({
      text,
      user_id,
    });

    const allMessages = await messageServices.listByUser(user_id);

    socket.emit('client_list_all_messages', allMessages);

    const allUsers = await connectionService.findAllWithoutAdmin();
    io.emit('admin_list_all_users', allUsers);
  });

  socket.on('client_send_to_admin', async (params) => {
    console.log('client_send_to_admin');
    const { text, socket_admin_id } = params;

    console.log({ text, socket_admin_id });

    const socket_id = socket.id;

    const { user_id } = await connectionService.findBySocketId(socket.id);

    const message = await messageServices.create({
      text,
      user_id,
    });

    io.to(socket_admin_id).emit('admin_receive_message', {
      message,
      socket_id,
    });
  });
});
