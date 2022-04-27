import { io } from '../http';
import { ConnectionsServices } from '../services/connectionsServices';
import { MessageServices } from '../services/messageServices';

io.on('connect', async (socket) => {
  const connectionService = new ConnectionsServices();
  const messageService = new MessageServices();
  const allConnectionsWithoutAdmin =
    await connectionService.findAllWithoutAdmin();

  io.emit('admin_list_all_users', allConnectionsWithoutAdmin);

  socket.on('admin_list_messages_by_user', async (params, callback) => {
    const { user_id } = params;
    const allMessages = await messageService.listByUser(user_id);

    callback(allMessages);
  });

  socket.on('admin_send_message', async (params) => {
    const { user_id, text } = params;

    await messageService.create({
      text,
      user_id,
      admin_id: socket.id,
    });

    const { socket_id } = await connectionService.findByUserId(user_id);
    console.log('sockkkett', socket_id);

    io.to(socket_id).emit('admin_send_to_client', {
      text,
      socket_id: socket.id,
    });
  });

  socket.on('admin_user_in_support', async (params) => {
    const { user_id } = params;
    await connectionService.updateAdminId(user_id, socket.id);
    const allConnectionsWithoutAdmin =
      await connectionService.findAllWithoutAdmin();

    io.emit('admin_list_all_users', allConnectionsWithoutAdmin);
  });
});
