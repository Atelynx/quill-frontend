Frontend Rules and Best Practices
This document defines the main standards for the project's frontend development. The primary goal is to keep the code clean and scalable, and to prevent files from becoming unmanageable.

1. Component Size and Maintenance
A React component should not be a "monolithic file." If a file is too long, it's a clear sign that it's not being componentized correctly or that code is being repeated.

Ideal limit: A component should not exceed 400 lines of code.

Strict limit: If a file approaches 1000 lines, it should be refactored and divided into smaller parts immediately.

General rule: A component should do one thing and do it well (Single Responsibility Principle). If it renders multiple distinct logical sections, each section should be its own component.

2. Reuse and Design System
Don't reinvent the wheel in every view. Visual and code consistency is essential.

Use the Design System: All UI elements (buttons, inputs, modals, fonts) should be imported from the Design System or the shared base components folder (/components/ui or similar). Don't add custom styles to core elements unless absolutely necessary.

DRY (Don't Repeat Yourself): Before creating a component from scratch, check if one already exists that solves the same problem. If you find a visual pattern that repeats in two or more places, make it a reusable component.

3. Data Flow (Props and Lifting State Up)
The way components communicate should be predictable.

Lifting State Up: If two sibling components need to share the same state, "lift" (move) that state to their nearest parent component.

Passing Props: Pass only the strictly necessary information to child components using props. Avoid prop drilling (passing props through multiple levels of components that don't use them just to get them to a deep child). If you find yourself doing this, consider using the Context API or global state.

4. State Management and Optimization
To avoid performance bottlenecks and unnecessary rendering, manage state intelligently.

Global State (Redux): Use Redux (e.g., Redux Toolkit) only for state that truly needs to be accessed globally by multiple parts of the application (user session, global settings, cached API data). Don't include local state (such as whether a modal is open or closed) in Redux.

Memoization (React.memo, useMemo, useCallback): * Use React.memo to prevent a child component from re-rendering if its props haven't changed.

Use useMemo to avoid recalculating expensive operations on every render.

Use useCallback to maintain the same reference to functions passed as props to child components, preventing these children from being unnecessarily re-rendered.