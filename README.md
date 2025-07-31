# Gilsanum Dashboard - Component Structure

## 📁 Project Structure

```
src/
├── components/
│   ├── layout/
│   │   ├── Layout.tsx       # Main layout wrapper
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── Navbar.tsx       # Top navigation bar
│   │   └── index.ts         # Layout exports
│   ├── dashboard/
│   │   ├── Dashboard.tsx         # Main dashboard container
│   │   ├── DashboardStats.tsx    # Stats cards container
│   │   ├── StatsCard.tsx         # Individual stat card
│   │   ├── SalesAnalytics.tsx    # Sales chart component
│   │   ├── ProductMonitoring.tsx # Product rankings
│   │   └── index.ts              # Dashboard exports
│   └── index.ts             # Main component exports
├── types/
│   └── index.ts             # TypeScript interfaces
├── App.tsx                  # Main app component
└── index.css               # Global styles with Tailwind
```

## 🧩 Component Overview

### Layout Components

#### `Layout.tsx`
- Main layout wrapper that combines sidebar and navbar
- Handles mobile responsive behavior
- Manages sidebar open/close state

#### `Sidebar.tsx`
- Navigation menu with hierarchical structure
- Responsive design (collapsible on mobile)
- Active state management
- Badge support for notifications

#### `Navbar.tsx`
- Top navigation bar
- User profile section
- Date range controls
- Action buttons (search, notifications, download)

### Dashboard Components

#### `Dashboard.tsx`
- Main dashboard container
- Orchestrates all dashboard components
- Provides data to child components

#### `DashboardStats.tsx`
- Container for all statistics cards
- Manages stats data array

#### `StatsCard.tsx`
- Reusable component for displaying metrics
- Supports positive/negative trends
- Customizable content and styling

#### `SalesAnalytics.tsx`
- Interactive chart component
- Dynamic height calculation
- Highlighted data points
- Legend and filters

#### `ProductMonitoring.tsx`
- Product ranking list
- Image support
- Sortable by different criteria

## 🔧 TypeScript Interfaces

### `MenuItemType`
```typescript
interface MenuItemType {
  id: string;
  label: string;
  icon: string;
  href: string;
  isActive?: boolean;
  badge?: number;
  children?: MenuItemType[];
}
```

### `StatsCardType`
```typescript
interface StatsCardType {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  description: string;
  highlightValue?: string;
}
```

### `ProductItemType`
```typescript
interface ProductItemType {
  id: string;
  rank: number;
  name: string;
  orders: number;
  image: string;
}
```

## 🎨 Styling

- **Framework**: Tailwind CSS v4
- **Design System**: Custom color palette with primary/secondary colors
- **Responsive**: Mobile-first approach
- **Components**: Modular, reusable styling

## 📱 Responsive Features

- **Mobile**: Collapsible sidebar with overlay
- **Tablet**: Responsive grid layouts
- **Desktop**: Full sidebar and optimized layouts

## 🚀 Benefits of This Structure

1. **Modularity**: Each component has a single responsibility
2. **Reusability**: Components can be easily reused
3. **Maintainability**: Easy to find and modify specific features
4. **Type Safety**: Full TypeScript support with interfaces
5. **Scalability**: Easy to add new components and features
6. **Testing**: Components can be tested in isolation
7. **Performance**: Tree-shaking friendly exports

## 🔄 Adding New Components

1. Create component in appropriate directory
2. Add TypeScript interfaces to `types/index.ts`
3. Export from respective `index.ts` file
4. Import and use in parent components

This structure follows React best practices and makes the codebase highly maintainable and scalable.
