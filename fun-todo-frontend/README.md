# Fun Todo Frontend

A modern, feature-rich todo application built with React, TypeScript, and Material-UI.

## Project Structure

The project follows a feature-based architecture for better organization and maintainability:

```
src/
├── api/                    # API clients and services
│   ├── auth.ts            # Authentication service
│   └── websocket.ts       # WebSocket service
├── features/              # Feature-based modules
│   ├── auth/             # Authentication feature
│   │   ├── components/   # Auth-related components
│   │   └── types/       # Auth-specific types
│   ├── dashboard/        # Dashboard feature
│   │   ├── components/   # Dashboard components
│   │   ├── charts/      # Chart components
│   │   └── types/       # Dashboard-specific types
│   ├── landing/         # Landing page feature
│   │   └── components/  # Landing page components
│   └── websocket/       # WebSocket feature
│       └── components/  # WebSocket components
├── shared/              # Shared code across features
│   ├── components/     # Shared components
│   ├── constants/      # Shared constants
│   ├── hooks/         # Shared custom hooks
│   ├── styles/        # Shared styles
│   ├── types/         # Shared TypeScript types
│   ├── utils/         # Shared utilities
│   └── validations/   # Shared form validations
├── assets/            # Static assets
├── App.tsx           # Main App component
└── main.tsx         # Application entry point
```

## Features

### Authentication
- User registration with email verification
- Login with email/password
- Google OAuth integration
- Protected routes

### Dashboard
- Real-time sensor data visualization
- Multiple view modes (grid, bar chart, table)
- Data filtering and sorting
- WebSocket integration for live updates

## Technology Stack

- React 18
- TypeScript
- Material-UI (MUI)
- Vite
- WebSocket
- Formik & Yup for form handling
- Google OAuth for authentication

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with required environment variables:
   ```
   VITE_API_URL=your_api_url
   VITE_WS_URL=your_websocket_url
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Development

### Code Organization
- Features are organized in self-contained modules under `src/features/`
- Shared code is placed in `src/shared/`
- API clients are centralized in `src/api/`
- Each feature contains its own components, types, and other related code

### Styling
- Material-UI (MUI) for component styling
- Shared styles in `src/shared/styles/`
- Feature-specific styles within feature modules

### Testing
- Tests are located in `__tests__` directories within each feature
- Run tests with `npm test`

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

MIT License
