# Chat Application

A modern chat application built with the MERN stack, incorporating real-time communication with Socket.io.

## Project Structure

- **clients/**: Frontend application built with React.
- **server/**: Backend application built with Node.js, Express, and MongoDB.

## Getting Started

Follow these instructions to set up and run the project on your local machine for development and testing purposes.

### Prerequisites

- Node.js
- MongoDB Atlas or local MongoDB setup

### Frontend (Clients)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/vasanth27s/vk-chat.git
Create and configure the .env file:

Create a .env file in the clients directory and add the following environment variables:
env

REACT_APP_API_URL=http://localhost:8000
Install dependencies:

bash

npm install
Run the application:

npm start
Backend (Server)
Navigate to the server directory:


cd ../server
Create and configure the .env file:

Create a .env file in the server directory and add the following environment variables:
env

PORT=8000
MONGO_URL=mongodb+srv://username:password@cluster0.mongodb.net/database_name?retryWrites=true&w=majority
SECRET_KEY=your_secret_key

BASE_URL=http://localhost:3000
Install dependencies:


npm install
Run the application:

npm start
Features
User authentication
Real-time messaging with Socket.io
Responsive design
Profile customization
Notifications
Technologies Used
Frontend: React, Redux, Chakra UI, Tailwind CSS
Backend: Node.js, Express, MongoDB, Socket.io
Authentication: JWT, OAuth
Contributing
Fork the repository
Create your feature branch (git checkout -b feature/your-feature)
Commit your changes (git commit -m 'Add some feature')
Push to the branch (git push origin feature/your-feature)
Open a pull request
License
This project is licensed under the MIT License - see the LICENSE file for details.

Acknowledgments
Inspiration from various online tutorials and documentation
Thanks to the open-source community for providing great tools and libraries
