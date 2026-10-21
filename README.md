# Verona

**Pizzeria · dal forno a te** — an Italian pizza ordering app with a live order tracker, pizza customization and a light/dark theme inspired by the city of Verona.

**Live demo:** [verona.vivianaein.dev](https://verona.vivianaein.dev)

![Verona — The best pizza. Straight out of the oven, straight to you.](public/preview.png)

## Table of contents

- [How I built it](#how-i-built-it)
- [Screenshots](#screenshots)
- [Features](#features)
- [Design](#design)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Deployment](#deployment)
- [License](#license)
- [Author](#author)

## How I built it

I started from a simple ordering flow (menu, cart, checkout and order lookup) built with React Router loaders and actions for data, and Redux Toolkit for the cart and the customer's details. The pizzas and orders come from a public pizza API.

Then I gave it an identity. I named it after Verona, designed a logo based on the city's Roman Arena seen from above, and built a light and a dark theme from the colors of Verona's marble and the Arena at night, using CSS variables with Tailwind so both themes share the same components.

After that I focused on the details that make ordering feel good:

1. **Finding a pizza:** search by name or ingredient, diet filters and sorting, all saved in the URL so a filtered menu can be shared.
2. **Making it yours:** a customize dialog to take toppings off or add extras, with each extra priced into the order.
3. **Feedback:** a pizza that flies into the cart, undo toasts, loading placeholders shaped like each page, and page transitions.
4. **After ordering:** a live order page with a countdown, automatic status refresh and a receipt, plus a "My orders" page with one-click reorder.
5. **Polish:** a cart and order history that survive a reload, designed 404 and error pages, page titles, and a responsive layout from phones to wide screens.

## Screenshots

| Home | Menu (dark theme) |
| --- | --- |
| ![Home page](docs/screenshots/home.png) | ![Menu with search and filters](docs/screenshots/menu.png) |

| Customize a pizza | Cart |
| --- | --- |
| ![Customize dialog](docs/screenshots/customize.png) | ![Cart page](docs/screenshots/cart.png) |

| Live order tracking (dark theme) |
| --- |
| ![Order tracking page](docs/screenshots/order-tracking.png) |

## Features

**Ordering**
- Browse the menu with vegetarian, meat, fish and spicy tags
- Search by pizza name or ingredient, with the match highlighted
- Filter by diet, hide sold-out pizzas and sort by price or name; filters are saved in the URL, so a filtered menu can be shared
- Customize any pizza: take toppings off for free or add up to three extras at €1.50 each
- A pizza photo flies into the cart bar when you add it
- Two-column checkout with phone validation, "Use my location" to fill in the address, and optional priority delivery (+20%)

**After ordering**
- Live order page: the countdown ticks every second, the status refreshes every 30 seconds, and a progress line fills as delivery time approaches
- Receipt-style order details with delivery address, phone, topping changes and a copyable order ID
- My orders: every order placed on this device, with its current status, **Track** and **Order again**. Reordering uses today's prices and skips sold-out pizzas
- Look up any order by its ID from the header

**Experience**
- Light theme *Rosso Verona* and dark theme *Notte all'Arena*, following the system setting until you choose
- Cart, name and order history survive a page reload
- Undo for removing a pizza or clearing the cart
- Page transitions, loading placeholders shaped like each page, and designed 404 and error pages
- A page title for every page, including the live order status ("In the oven · Order #VRN7QX")
- Responsive from 360px phones to wide screens, with keyboard focus states and reduced-motion support

## Design

- **Name:** Verona, the Italian city of Romeo and Juliet and of a Roman amphitheatre, the Arena, from 30 AD.
- **Logo:** the Arena seen from above is an oval ring around a central floor. Drawn simply, it's also a pizza, so the mark is an oval pizza with one slice pulled out.
- **Colors:** the light theme uses *Rosso Verona*, the pink-red marble the Arena is built from. The dark theme, *Notte all'Arena*, uses candle gold on deep violet, after the candles the audience lights at the Arena's summer opera.

  | Role | Light | Dark |
  | --- | --- | --- |
  | Accent | `#A8423F` | `#E3C27A` |
  | Background | `#F6F1F0` | `#15121A` |
  | Text | `#2A1C1F` | `#EFE6D8` |

- **Type:** [Italiana](https://fonts.google.com/specimen/Italiana) for the logo, headings and pizza names; [Jost](https://fonts.google.com/specimen/Jost) for everything you read or tap.

## Tech stack

- [React](https://react.dev) and TypeScript
- [Vite](https://vite.dev)
- [React Router](https://reactrouter.com): loaders, actions, fetchers and view transitions
- [Redux Toolkit](https://redux-toolkit.js.org) and React Redux
- [Tailwind CSS](https://tailwindcss.com)
- [dotLottie](https://github.com/LottieFiles/dotlottie-web) for animations
- Hosted on [Cloudflare Pages](https://pages.cloudflare.com)

## Project structure

```text
src/
  features/
    cart/       Cart page, cart slice, undo actions, floating cart bar
    menu/       Menu, filters, search, customize dialog, menu skeleton
    order/      Checkout, order tracking, receipt, order history, reorder
    user/       Name and geolocation address
  hooks/        useNow, useScrolled, useTitle
  services/     API calls for pizzas, orders and reverse geocoding
  ui/           Layout, header, logo, theme toggle, toasts, buttons, error pages
  utils/        Types, cart-line helpers, persistence, fly-to-cart animation
public/         Favicon, link-preview image, Cloudflare headers
```

## Getting started

```bash
git clone git@github.com:naked-vivi/fast-pizza.git
cd fast-pizza
npm install
npm run dev
```

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the dev server at http://localhost:5173 |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

No environment variables are needed; the app uses a public pizza API.

## Deployment

The site is deployed on Cloudflare Pages:

- **Build command:** `npm run build`
- **Output directory:** `dist`

Cloudflare Pages serves `index.html` for app routes like `/menu` automatically, because the project has no `404.html`. Cache headers for the built assets are in [`public/_headers`](public/_headers).

## License

Released under the [MIT License](LICENSE).

## Author

Built by [naked-vivi](https://github.com/naked-vivi).
