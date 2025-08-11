for dark mode we are going to use next themes
-create folder context create file themes.tsx
provide <ThemeProvider
         attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange
        >
{children}
</ThemeProvider> to the child in layout

npm install next-themes
npx shadcn@latest init


- dropdown