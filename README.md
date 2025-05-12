# Island Table - Private Chef Services Website

A modern, minimalist website for a Kauai-based private chef business. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

- Responsive, mobile-first design
- Smooth animations and transitions
- Contact form for inquiries
- Service offerings showcase
- Modern, clean UI with tropical aesthetics

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm 9.x or later

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd island-table
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   - Copy `env.example` to `.env.local`
   - Fill in the required environment variables:
     - Auth0 configuration for authentication
     - Airtable configuration for database
     - Brevo API key for email sending
     - Resend API key for additional email functionality
     - Pexels API key for image generation
     - Public URL configuration

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
src/
├── app/              # Next.js app directory
│   ├── page.tsx     # Home page
│   ├── offerings/   # Offerings page
│   ├── contact/     # Contact page
│   └── layout.tsx   # Root layout
├── components/      # React components
└── styles/         # Global styles
```

## Technologies Used

- Next.js 14
- TypeScript
- Tailwind CSS
- Framer Motion
- React
- Auth0 for authentication
- Airtable for database
- Brevo for email services
- Resend for additional email functionality
- Pexels for image generation

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 