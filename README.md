# Fast React Pizza

Fast React Pizza is a pizza ordering web app built with React, TypeScript, Redux Toolkit, React Router, Tailwind CSS, and Vite. Users can enter their name, browse the pizza menu, add items to a cart, place an order, search for an existing order, and mark an order as priority.

## Features

- Browse a pizza menu loaded from an external API
- Add pizzas to the cart and update item quantities
- Remove individual items or clear the cart after ordering
- Calculate total cart quantity and total cart price
- Create a new order with customer details, cart data, and priority option
- Validate phone numbers before submitting an order
- Use browser geolocation and reverse geocoding to help fill in the delivery address
- Search for an order by order ID
- View order status, estimated delivery time, order items, and total price
- Upgrade an existing order to priority
- Responsive styling with Tailwind CSS

## Tech Stack

- React
- TypeScript
- Vite
- React Router
- Redux Toolkit
- React Redux
- Tailwind CSS
- ESLint
- Prettier

## Project Structure

```text
src/
  features/
    cart/       Cart UI, cart actions, and cart Redux slice
    menu/       Menu loader and menu item UI
    order/      Order creation, order details, and priority updates
    user/       Username and address state
  services/     API helpers for restaurant data and reverse geocoding
  ui/           Shared layout and reusable UI components
  utils/        Shared TypeScript types and helper functions
```

## How I Built This Project

1. Created the project with Vite using React and TypeScript.
2. Added Tailwind CSS for fast, responsive styling.
3. Set up React Router routes for the home page, menu, cart, new order form, and order details page.
4. Connected route loaders and actions so the app can fetch menu data, create orders, load order details, and update priority status.
5. Built reusable UI components such as buttons, layout, header, loaders, and error views.
6. Created a Redux store with slices for cart and user data.
7. Added cart behavior for adding pizzas, deleting pizzas, changing quantities, and calculating totals.
8. Added order form validation, including phone number validation.
9. Integrated browser geolocation with a reverse geocoding API to help users fill in their delivery address.
10. Tested the user flow from entering a name, browsing the menu, creating a cart, placing an order, and searching for an order.

## What I Learned

While building this project, I learned how to organize a React application by features instead of putting all components in one folder. This made the project easier to understand, maintain, and scale. I also learned how React Router loaders and actions can be used to fetch data and handle form submissions close to the routes that need them. This helped keep the code cleaner and more organized. Redux Toolkit helped me manage global state more easily, especially for user information and cart data. I also learned how useful derived selectors are for calculating totals, item quantities, and other values that are reused across different components. This project also helped me improve my TypeScript skills by using types with React components, route actions, API functions, and Redux state. I became more comfortable writing safer and more predictable code. For styling, I used Tailwind CSS to build responsive layouts quickly with utility classes. I also practiced handling asynchronous work such as API requests, geolocation, loading states, and error messages.

## Challenges

One of the main challenges in this project was managing the cart state across different pages while making sure the UI updated immediately whenever the user added, removed, or changed an item. Another challenge was handling form submissions with React Router actions while still validating the user’s input properly. I also had to work with external APIs, so I needed to handle failed requests and show helpful error messages instead of leaving the user confused. The geolocation feature was also a little challenging because it involved connecting browser permissions, coordinates, and reverse geocoding to fill in the user’s address smoothly. I also had to keep TypeScript types consistent across API data, Redux state, and component props. This helped make the code safer, but it required careful planning. Finally, I worked on making the interface responsive so the menu, cart, and order form could work well on different screen sizes.

## Future Improvements

- Add automated tests for cart reducers, route actions, and key user flows
- Improve form validation for customer details and delivery addresses
- Add order history for returning users
- Add loading skeletons for menu and order pages
- Improve accessibility for form controls and interactive cart buttons

## Author

Built as a React learning project.
