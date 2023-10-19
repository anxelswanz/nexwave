const express = require("express")
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute");
const messageRoute = require("./routes/messagesRoute");
const app = express();
//const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json())
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoute);

mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }
    ).then(() => {
        console.log('DB connect successfully');
    }).catch((error) => {
        console.log(error);
    });
const server = app.listen(process.env.PORT, () => {
    console.log(`server started on port ${process.env.PORT}`);
});


// const io = socket(server, {
//     cors: {
//         origin: "http://localhost:8081",
//         credentials: true,
//     },
// });
const io = require("socket.io")(server, { cors: true });

const onlineUsers = new Map();

io.on("connection", (socket) => {

    socket.on("add-user", (userId) => {
        onlineUsers.set(userId, socket.id);
        console.log('用户连接.....', userId);
    });
    socket.on("send-message", (data) => {
        console.log('send msg here', data);
        const sendUserSocket = onlineUsers.get(data.to);
        console.log(onlineUsers.get(data.to));
        if (sendUserSocket) {
            console.log('yes i am sendusersocket', data);
            socket.to(sendUserSocket).emit("msg-receive", data);
        }
    })
})
