# Dark Mode Implementation Guide

## Overview
Implementing dark mode functionality using `next-themes` library with shadcn/ui components.

## Step 1: Install Dependencies

### Install next-themes
```bash
npm install next-themes
```

### Initialize shadcn/ui
```bash
npx shadcn@latest init
```

## Step 2: Setup Theme Provider

### Create Theme Context
1. Create folder: `context/`
2. Create file: `context/Theme.tsx`
3. Add ThemeProvider configuration:

```tsx
"use client"
import { ThemeProvider as NextThemesProvider } from 'next-themes'
import { ThemeProviderProps } from 'next-themes'

const ThemeProvider = ({children,...props}:ThemeProviderProps) => {
  return (
    <NextThemesProvider {...props}>
      {children}
    </NextThemesProvider>
  )
}

export default ThemeProvider
```

### Wrap App with ThemeProvider
In `app/layout.tsx`, wrap children with:
```tsx
<ThemeProvider
  attribute="class" 
  defaultTheme="system" 
  enableSystem 
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

## Step 3: Create Navigation Components

### Install Required Components
```bash
npx shadcn@latest add button
npx shadcn@latest add dropdown-menu
```

### Create Navigation Structure
1. **Create Navbar** - Main navigation component
2. **Create Theme Toggler** - Theme switching component
   - Create `components/navigation/navbar/Theme.tsx`
   - Copy theme toggle code from [shadcn dark mode docs](https://ui.shadcn.com/docs/dark-mode)

## Step 4: Implementation Checklist

- [x] Install next-themes
- [x] Initialize shadcn/ui
- [x] Create Theme context
- [x] Setup ThemeProvider in layout
- [x] Install button component
- [ ] Create navbar component
- [ ] Create theme toggler component
- [ ] Add dropdown menu functionality
- [ ] Test theme switching

## Resources
- [Next Themes Documentation](https://github.com/pacocoursey/next-themes)
- [Shadcn Dark Mode Guide](https://ui.shadcn.com/docs/dark-mode)