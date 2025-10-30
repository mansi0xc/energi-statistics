# ChainGPT Analytics

A fullstack web application using Next.js, Tailwind CSS, and Framer Motion that provides a chat interface to interact with ChainGPT and an analytics dashboard to visualize session data.

## Features

### Chat Interface
- Beautiful dark + neon green/teal theme with PixelBlast animated background
- Real-time chat with ChainGPT AI
- Animated message bubbles with typing indicators
- Session tracking for analytics

### Analytics Dashboard
- Visualize session data with interactive charts
- Metrics include:
  - Unique users
  - Total sessions
  - Total questions
  - Session hours
  - Browser and device distribution
  - Geographic distribution
  - Session duration
  - Question distribution

## Tech Stack

- **Frontend**: Next.js 14, React 18, Tailwind CSS, Framer Motion
- **Visualization**: Recharts
- **3D Graphics**: Three.js, Postprocessing
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd energi-statistics
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following variables:
```
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/chaingpt

# API Keys
CHAINGPT_API_KEY=your_chaingpt_api_key_here
IPINFO_API_KEY=your_ipinfo_api_key_here

# Security
IP_ENCRYPTION_SALT=your_random_encryption_salt_here

# Optional - ChainGPT API Configuration
CHAINGPT_API_URL=https://api.chaingpt.org/v1/chat
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/app` - Next.js App Router pages and API routes
- `/components` - React components
  - `/analytics` - Dashboard components and charts
- `/lib` - Utility functions, MongoDB connection, and models

## API Routes

- `POST /api/chaingpt` - Sends user message to ChainGPT and returns response
- `POST /api/session/start` - Creates a new session and logs user data
- `POST /api/session/end` - Ends a session and calculates metrics
- `GET /api/analytics` - Retrieves aggregated analytics data

## Customization

- Modify the theme colors in `tailwind.config.js` and `app/globals.css`
- Adjust PixelBlast background parameters in `app/page.js` and `app/analytics/page.js`
- Update the chat greeting message in `components/ChatContainer.js`

## Deployment

This project can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

Make sure to set up the environment variables in your Vercel project settings.

## License

[MIT License](LICENSE)