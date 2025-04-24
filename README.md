# Reader Mode

A clean, distraction-free article reading experience built with React, Convex, and Tailwind CSS. This application allows users to read articles from their subscribed websites in a minimalist, reader-friendly format.

## Features

- **Clean Reading Interface**: Strips away ads, navigation bars, and other distractions
- **Authentication Support**: Use your existing website subscriptions
- **Per-Domain Configuration**: Save authentication settings for each website
- **Real-time Updates**: Built with Convex for instant content delivery
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Modern UI**: Built with Tailwind CSS for a sleek, modern look

## Tech Stack

- **Frontend**: React + Vite
- **Backend**: Convex
- **Styling**: Tailwind CSS
- **Authentication**: Convex Auth
- **HTML Parsing**: node-html-parser
- **Notifications**: Sonner

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Convex account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/reader-mode.git
cd reader-mode
```

2. Install dependencies:
```bash
npm install
```

3. Create a Convex deployment:
```bash
npx convex dev
```

4. Start the development server:
```bash
npm run dev
```

### Usage

1. Sign in to the application
2. Click the ⚙️ button to configure site authentication
3. Enter your authentication headers as a JSON object:
```json
{
  "cookie": "your_session_cookie_here",
  "user-agent": "Mozilla/5.0...",
  "referer": "https://example.com"
}
```
4. Save the configuration
5. Paste an article URL and click "Read"

#### Getting Authentication Headers

1. Log into your subscribed website in your browser
2. Open Developer Tools (F12)
3. Go to the Network tab
4. Load an article page
5. Click on the main article request
6. Copy the relevant headers (Cookie, User-Agent, etc.)

## Project Structure

```
├── convex/                 # Convex backend functions
│   ├── articles.ts        # Article-related functions
│   ├── fetch.ts           # Article fetching logic
│   ├── sites.ts           # Site configuration management
│   └── schema.ts          # Database schema
├── src/                   # Frontend source code
│   ├── App.tsx           # Main application component
│   ├── SignInForm.tsx    # Authentication form
│   └── SignOutButton.tsx # Logout button
└── public/               # Static assets
```

## Features

- **Article Parsing**: Extracts main content, title, and author
- **Content Cleaning**: Removes unwanted elements like ads and popups
- **Authentication Storage**: Securely stores authentication per domain
- **Error Handling**: Graceful error handling with user feedback
- **Loading States**: Visual feedback during article fetching

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Convex](https://convex.dev) for the backend infrastructure
- [Tailwind CSS](https://tailwindcss.com) for styling
- [node-html-parser](https://github.com/taoqf/node-html-parser) for HTML parsing

## Disclaimer

This tool is intended to be used with your own valid subscriptions to access content you have rights to read. It does not circumvent paywalls or access unauthorized content.
