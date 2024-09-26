const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load the .proto file
const packageDefinition = protoLoader.loadSync('todo.proto', {});
const grpcObject = grpc.loadPackageDefinition(packageDefinition);
const todoPackage = grpcObject.todoPackage;

const server = new grpc.Server();
server.bindAsync('0.0.0.0:4000', grpc.ServerCredentials.createInsecure(), (err, port) => {
    if (err) {
        console.error('Server binding failed:', err);
        return;
    }
    console.log(`gRPC Server running on port ${port}`);
    server.start();
});

// Adding services to the gRPC server
server.addService(todoPackage.Todo.service, {
    createTodo: createTodo,
    readTodos: readTodos,
    readTodosStream: readTodosStream,
});

const todos = [];

function createTodo(call, callback) {
    const todoItem = {
        id: todos.length + 1,
        text: call.request.text,
    };
    todos.push(todoItem);
    console.log('Todo Created:', todoItem);
    callback(null, todoItem);
}

function readTodos(call, callback) {
    callback(null, { items: todos });
}

function readTodosStream(call) {
    todos.forEach((todoItem) => call.write(todoItem));
    call.end();
}