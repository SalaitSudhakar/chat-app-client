# Chat App Frontend

A modern React-based frontend for a real-time chat application built with Vite, React 19, Tailwind CSS, and Socket.IO.

## Features

- **Real-time Messaging**: Instant message delivery using Socket.IO
- **Modern UI**: Sleek interface built with React 19 and Tailwind CSS
- **Responsive Design**: Fully responsive across all device sizes
- **User Authentication**: Secure login and registration
- **Profile Management**: Update profile information and avatar
- **Real-time Notifications**: Instant message notifications
- **Image Sharing**: Send and receive images in conversations
- **Various theme**: Toggle between themes using DaisyUI

## Tech Stack

- **React 19**: Latest version of React with improved performance
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS 4**: Utility-first CSS framework
- **DaisyUI**: Component library for Tailwind CSS
- **Socket.IO**: Real-time bidirectional event-based communication
- **Zustand**: Lightweight state management
- **React Router 7**: For navigation and routing
- **Axios**: For HTTP requests
- **React Hot Toast**: For beautiful notifications

## Prerequisites

- Node.js (v18.x or higher recommended)
- npm or yarn
- Backend API server running [refer to backend README](https://github.com/SalaitSudhakar/chat-app-server)

## Getting Started

### Installation

1. Clone the repository

   ```bash
   git clone https://github.com/SalaitSudhakar/chat-app-client
   cd chat-app-client
   ```

2. Install dependencies

   ```bash
   npm install
   # or
   yarn
   ```

3. Create a `.env` file in the root directory

   ```VITE_MODE=development || production
   VITE_SOCKET_URL=http://localhost:5000
   ```

4. Start the development server
   ```bash
   npm run dev
   # or
   yarn dev
   ```

The application will be available at `http://localhost:5173`

## Key Features Implementation

### Authentication

The application uses token-based authentication. Tokens are stored in cookies and included in Axios request headers.

### Real-time Communication

Socket.IO is used to establish real-time communication with the backend:

- Connection management

- User online status

- Message delivery and typing indicators

- Notifications for new messages

### State Management

Zustand is used for state management, providing a simple and efficient way to share state across components.

### Responsive Design

The UI is fully responsive, adapting to different screen sizes using Tailwind CSS's responsive utilities.
