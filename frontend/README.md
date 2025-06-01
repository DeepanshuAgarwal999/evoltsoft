# EvoltSoft Frontend

A modern Vue.js 3 frontend application for managing electric vehicle charging stations with interactive maps, advanced filtering, and responsive design.

## 🚀 Features

- **Interactive Dashboard**: Modern UI for managing charging stations
- **Advanced Filtering**: Real-time filtering by status, power, connector type, and more
- **Interactive Maps**: Leaflet integration for location visualization
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Real-time Search**: Debounced search with URL synchronization
- **User Authentication**: Complete login/signup flow
- **Modern Stack**: Vue 3 Composition API with TypeScript support

## 🛠 Tech Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **Language**: TypeScript/JavaScript
- **Styling**: Tailwind CSS
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Maps**: Leaflet
- **Notifications**: Vue Sonner
- **Icons**: Heroicons (SVG)

## 📋 Prerequisites

- Node.js (v16 or higher)
- pnpm, npm, or yarn package manager
- Backend API running on `http://localhost:3000`

## ⚙️ Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd evoltsoft/frontend
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   VITE_APP_BASE_URL=http://localhost:3000
   ```

4. **Start development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

The application will run on `http://localhost:5173`

## 📁 Project Structure

```
frontend/
├── public/
│   └── favicon.ico
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── Login.vue          # Login form
│   │   │   └── SignUp.vue         # Registration form
│   │   ├── shared/
│   │   │   ├── AuthHeader.vue     # Authentication header
│   │   │   ├── Button.vue         # Reusable button component
│   │   │   ├── Footer.vue         # App footer
│   │   │   ├── Loader.vue         # Loading spinner
│   │   │   └── Navbar.vue         # Navigation bar
│   │   ├── ChargerStationCard.vue # Station card component
│   │   ├── CreateStation.vue      # Create/edit station form
│   │   ├── FilterChargerStation.vue # Advanced filtering sidebar
│   │   ├── Home.vue               # Main dashboard
│   │   ├── MapView.vue            # Map visualization
│   │   └── StreetMap.vue          # Interactive map component
│   ├── composables/
│   │   └── useAuth.ts             # Authentication composable
│   ├── config/
│   │   └── axios.instance.ts      # HTTP client configuration
│   ├── routes/
│   │   └── index.ts               # Route definitions
│   ├── services/
│   │   ├── charger-service.ts     # Charging station API
│   │   └── user-service.ts        # User authentication API
│   ├── assets/                    # Static assets and styles
│   ├── App.vue                    # Root component
│   ├── main.js                    # Application entry point
│   └── vite-env.d.ts             # TypeScript environment types
├── index.html                     # HTML template
├── vite.config.js                # Vite configuration
├── tailwind.config.js            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies and scripts
```

## 🎨 UI Components

### Layout

- **Sidebar Layout**: Filter panel on the left, main content on the right
- **Responsive Design**: Adapts to mobile, tablet, and desktop screens
- **Modern Styling**: Gradient backgrounds, glass morphism effects

### Key Components

#### 1. **FilterChargerStation.vue**

Advanced filtering sidebar with:

- Status filter (Active/Inactive)
- Power output range
- Connector type selection
- Name search with debouncing
- Sort options (newest/oldest)
- URL synchronization

#### 2. **ChargerStationCard.vue**

Station display cards featuring:

- Station information
- Status indicators
- Power output display
- Map view button
- Edit/delete actions

#### 3. **MapView.vue**

Interactive map component:

- Leaflet integration
- Coordinate display from URL params
- Marker positioning
- Responsive design

#### 4. **CreateStation.vue**

Station creation/editing form:

- Interactive map for location selection
- Form validation
- Real-time coordinate display
- Edit mode support

## 🗺️ Routing

| Route               | Component         | Description               |
| ------------------- | ----------------- | ------------------------- |
| `/`                 | Home.vue          | Main dashboard            |
| `/auth`             | Auth components   | Login/signup              |
| `/create-station`   | CreateStation.vue | Create new station        |
| `/edit-station/:id` | CreateStation.vue | Edit existing station     |
| `/map/:lat/:lng`    | MapView.vue       | Map view with coordinates |

## 🔧 Configuration

### Environment Variables

| Variable            | Description     | Default               |
| ------------------- | --------------- | --------------------- |
| `VITE_APP_BASE_URL` | Backend API URL | http://localhost:3000 |

### Tailwind CSS

Custom configuration with:

- Extended color palette
- Custom animations
- Responsive breakpoints
- Gradient utilities

### Axios Configuration

- Base URL from environment
- JWT token interceptors
- Request/response logging
- Error handling

## 📱 Features

### 1. **Dashboard**

- Station statistics overview
- Real-time filtering
- Responsive grid layout
- Empty state handling

### 2. **Advanced Filtering**

- Multiple filter criteria
- URL synchronization
- Debounced search
- Active filter indicators

### 3. **Interactive Maps**

- Leaflet integration
- Click-to-select coordinates
- Responsive design
- Multiple map views

### 4. **Authentication**

- JWT-based authentication
- Protected routes
- Auto-redirect on login/logout
- Form validation

### 5. **Responsive Design**

- Mobile-first approach
- Adaptive layouts
- Touch-friendly interactions
- Progressive enhancement

## 🎯 State Management

### Composition API

- Reactive data with `ref()` and `reactive()`
- Computed properties for derived state
- Watchers for side effects
- Lifecycle hooks for component management

### URL Synchronization

- Filter state in URL query parameters
- Browser back/forward navigation
- Shareable filtered views
- Persistent filter state

## 🚀 Performance

### Optimization Features

- **Debounced Search**: Prevents excessive API calls
- **Lazy Loading**: Components loaded on demand
- **Efficient Filtering**: Client-side and server-side filtering
- **Optimized Builds**: Vite's fast build system

### Bundle Size

- Tree-shaking enabled
- Dynamic imports
- Optimized dependencies
- Minimal runtime overhead

## 🧪 Development

### Available Scripts

```bash
# Development server
pnpm dev

# Production build
pnpm build

# Preview production build
pnpm preview

# Type checking
vue-tsc --noEmit
```

### Code Style

- **TypeScript**: Type safety and better DX
- **Composition API**: Modern Vue 3 patterns
- **Single File Components**: Organized component structure
- **Consistent Naming**: PascalCase for components

## 🔄 API Integration

### HTTP Client (Axios)

```typescript
// Automatic token attachment
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_URL,
  timeout: 180000,
});

// Request interceptor for auth
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Service Layer

- **ChargerService**: CRUD operations for stations
- **UserService**: Authentication and user management
- Type-safe API calls
- Error handling and validation

## 🎨 Styling

### Tailwind CSS Features

- **Utility-first**: Rapid development
- **Responsive**: Mobile-first breakpoints
- **Dark mode**: Ready for theme switching
- **Custom components**: Reusable UI patterns

### Design System

- **Colors**: Consistent brand palette
- **Typography**: Inter font family
- **Spacing**: 8px grid system
- **Shadows**: Layered depth effects

## 📱 Browser Support

- **Modern Browsers**: Chrome 88+, Firefox 85+, Safari 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 88+
- **ES2020**: Modern JavaScript features
- **CSS Grid**: Advanced layout support

## 🔒 Security

### Authentication

- JWT token storage in localStorage
- Automatic token refresh (if implemented)
- Protected route guards
- CSRF protection via SameSite cookies

### Data Validation

- Client-side form validation
- Type checking with TypeScript
- Input sanitization
- XSS prevention



Built with ❤️ using Vue.js 3 and modern web technologies.
