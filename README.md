# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Component Development Rules

Follow these rules when developing components in this project:

### 1. File Organization

- **One component per file** (except for small, tightly coupled components)
- Component files should **not exceed 300 lines** (excluding styles)
- For screens, the limit is **500 lines** - extract reusable components when exceeding this limit

### 2. Export Standards

- **Named exports** for all components (except for screens which can use default exports)

```tsx
// ✅ Correct
export const MyComponent: React.FC<MyComponentProps> = ({ ... }) => { ... }

// ❌ Incorrect (for non-screen components)
export default MyComponent;
```

### 3. TypeScript Requirements

- **Always use TypeScript interfaces** for props
- Include proper prop validation and default values
- Add JSDoc comments for complex components

```tsx
interface MyComponentProps {
  /** Description of the prop */
  title: string;
  /** Optional callback function */
  onPress?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onPress,
}) => {
  // Component logic
};
```

### 4. Theme Integration

- **Theme integration required** for all UI components
- Always use the `useTheme` hook for colors and styling

```tsx
import { useTheme } from "../contexts/ThemeContext";

export const MyComponent: React.FC = () => {
  const { colors } = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: colors.surface,
      // ...
    },
  });
};
```

### 5. Conditional Rendering

- **Always wrap `&&` conditional rendering** in `ConditionalComponent` for consistent default rendering

```tsx
// ❌ Don't do this
{
  condition && <Component />;
}

// ✅ Do this instead
<ConditionalComponent isValid={!!condition}>
  <Component />
</ConditionalComponent>

// ✅ With default component
<ConditionalComponent
  isValid={!!condition}
  defaultComponent={<EmptyState />}
>
  <Component />
</ConditionalComponent>
```

### 6. Accessibility Considerations

- Include proper labels for screen readers
- Ensure touch targets are at least 44x44 points
- Use semantic HTML/components when possible

### 7. Platform-Specific Optimizations

- Use `Platform.select()` for platform-specific styles
- Include proper shadow/elevation for both iOS and Android

```tsx
const styles = StyleSheet.create({
  card: {
    ...Platform.select({
      ios: {
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

### 8. Component Structure

Organize your component files in this order:

1. Imports
2. Type/Interface definitions
3. Component definition
4. Styles (using `StyleSheet.create()`)
5. Exports

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
