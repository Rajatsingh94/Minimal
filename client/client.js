const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

// Load the .proto file
const packageDef = protoLoader.loadSync("todo.proto", {});
const grpcObject = grpc.loadPackageDefinition(packageDef);
const todoPackage = grpcObject.todoPackage;

// gRPC client
const client = new todoPackage.Todo("grpc-server:4000", grpc.credentials.createInsecure());

// Express server to serve the frontend and handle API requests
const app = express();
const PORT = 8080;

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Serve static files (including index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root path
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Handle creating a new todo via gRPC
app.post("/create", (req, res) => {
    const todoText = req.body.text;
    
    // Check if the text is provided
    if (!todoText) {
        return res.status(400).json({ error: "Todo text is required" });
    }

    // Call the gRPC service to create the todo
    client.createTodo({ text: todoText }, (err, response) => {
        if (err) {
            console.error("Error creating todo:", err);
            return res.status(500).json({ error: "Failed to create todo" });
        }

        // Send back the created todo item as a JSON response
        res.json(response);
    });
});

// Handle fetching todos via gRPC
app.get("/todos", (req, res) => {
    client.readTodos({}, (err, response) => {
        if (err) {
            console.error("Error fetching todos:", err);
            return res.status(500).json({ error: "Failed to fetch todos" });
        }

        // Send back the list of todos as a JSON response
        res.json(response);
    });
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Client HTTP server running on port ${PORT}`);
});