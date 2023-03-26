import { createServer } from "http";
import { Server, type Socket } from "socket.io";

const PORT = parseInt(process.env.PORT || "8080");

const server = createServer();

const io = new Server(server, {
  serveClient: false,
  cookie: true,
  transports: ["websocket"],
  cors: {
    origin: (requestOrigin, callback) => {
      callback(null, requestOrigin);
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

function onConnection(socket: Socket) {
  const id = socket.id,
    namespace = socket.nsp;

  socket.on("announce", () => {
    namespace.emit("announce", id);
  });
  socket.on("signal", (to: string, message: any) => {
    namespace.sockets.get(to)?.emit("signal", message, id);
  });
  socket.on("disconnect", (reason) => {
    namespace.emit("leave", id, reason);
  });
  namespace.emit("join", id);
}

io.on("connection", onConnection);
io.of(/.*/).on("connection", onConnection);

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
