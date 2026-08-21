# Fast Pizza

Fast Pizza is a pizza ordering web application built with React, TypeScript, Redux, Redux Thunk, and Tailwind CSS. It allows users to enter their name, browse the pizza menu, add items to a cart, and place an order with or without priority delivery.

The app calculates the total order price automatically based on the selected pizzas, quantities, and priority option. Payment is handled outside the application.

## Features

- Enter user name before ordering
- View available pizza menu
- Add pizzas to cart
- Update item quantities
- Remove items from cart
- Calculate total cart price
- Choose priority order option
- Place an order
- Responsive design with Tailwind CSS
- Global state management using Redux
- Async logic handled with Redux Thunk

## Tech Stack

- React
- TypeScript
- Redux
- Redux Thunk
- Tailwind CSS

## Project Description

Fast Pizza provides a simple and smooth ordering experience for users who want to quickly select pizzas and submit an order. The user starts by entering their name, then views the menu and adds pizzas to the cart.

The cart keeps track of selected items, quantities, and prices. Before placing the order, the user can choose whether the order should be marked as priority. The final price is calculated in the app, while payment is completed outside the system.

## Main Functionality

1. User enters their name.
2. The pizza menu is displayed.
3. User adds pizzas to the cart.
4. User can update quantities or remove items.
5. The app calculates the total price.
6. User chooses priority delivery or normal delivery.
7. User places the order.

## State Management

Redux is used to manage application state such as:

- User information
- Pizza menu
- Cart items
- Order details
- Priority status

Redux Thunk is used to handle asynchronous operations, such as fetching menu data and submitting orders.

## Styling

Tailwind CSS is used for styling the user interface. It helps create a clean, responsive, and modern design with utility classes.

## Payment

This project does not include an online payment system. The order price is calculated inside the app, but payment is handled externally.

## Purpose

This project demonstrates how to build a modern React application using TypeScript, Redux, Redux Thunk, and Tailwind CSS. It focuses on routing, state management, cart logic, form handling, and creating a clean user experience.

## Installation

```bash
npm install
npm run dev
