# Order Management Feature - Food Delivery App

A complete order management system for a food delivery application built with Next.js (frontend) and Express.js (backend). Features include menu display, cart functionality, order placement, and real-time order status tracking.

## Features

### 1. Menu Display
- Browse 12 delicious food items with high-quality images
- Categories: Pizza, Burgers, Salads, Pasta, Sushi, Mexican
- Each item includes name, description, price, and image

### 2. Order Placement
- Add items to cart with customizable quantities
- View cart with item management (update quantity, remove items)
- Checkout with delivery details (name, address, phone)
- Form validation for all fields

### 3. Order Status Tracking
- Real-time status updates via polling
- Status flow: Order Received → Preparing → Out for Delivery → Delivered
- Automatic status transitions simulated in backend
- Visual progress indicator

### 4. Backend API
- RESTful API with Express.js
- In-memory data storage
- Comprehensive input validation
- Error handling with meaningful messages

### 5. Testing
- Backend API tests (26 test cases)
- Frontend component tests
- Test coverage reports

## Tech Stack

### Frontend
- **Framework**: Next.js 14 (JavaScript)
- **State Management**: React Context API
- **Styling**: CSS Modules
- **Testing**: Jest + React Testing Library

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Data Storage**: In-memory (JavaScript arrays)
- **Testing**: Jest + Supertest
- **Validation**: Custom middleware

## Project Structure

```
raftlabs/
├── backend/
│   ├── src/
│   │   ├── routes/           # API routes
│   │   ├── controllers/      # Route handlers
│   │   ├── data/            # In-memory data
│   │   ├── middleware/      # Validation middleware
│   │   └── app.js          # Express app setup
│   ├── tests/              # Backend tests
│   ├── package.json
│   └── server.js           # Server entry point
│
├── frontend/
│   ├── src/
│   │   ├── app/            # Next.js pages
│   │   ├── components/     # React components
│   │   ├── context/        # CartContext
│   │   └── services/       # API service layer
│   ├── tests/             # Frontend tests
│   ├── package.json
│   └── next.config.js
│
├── tests/                 # Shared tests
└── package.json          # Root package.json
```

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd raftlabs
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

#### Option 1: Run Backend and Frontend Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Backend will start on http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend will start on http://localhost:3000

#### Option 2: Using Concurrently (if configured)
```bash
npm run dev:backend  # Terminal 1
npm run dev:frontend # Terminal 2
```

### Running Tests

**Backend Tests:**
```bash
cd backend
npm test
```

**Frontend Tests:**
```bash
cd frontend
npm test
```

## API Endpoints

### Menu
- `GET /api/menu` - Get all menu items
- `GET /api/menu/:id` - Get single menu item

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders` - Get all orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/:id/status` - Get order status
- `PATCH /api/orders/:id/status` - Update order status

## Order Status Flow

Orders automatically progress through these statuses:
1. **received** (immediately after order creation)
2. **preparing** (after 10 seconds)
3. **out_for_delivery** (after 25 seconds)
4. **delivered** (after 35 seconds)

The frontend polls for status updates every 3 seconds.

## Design Decisions

### Why Polling over WebSocket?
- **Simplicity**: Easier to implement and maintain
- **No External Dependencies**: No need for socket.io or ws library
- **Adequate for Use Case**: Status updates don't require real-time precision
- **Better for Serverless**: Works well with serverless deployments

### Why In-Memory Storage?
- **Simplicity**: No database setup required
- **Fast**: No network latency
- **Demo Purpose**: Suitable for demonstration and testing
- **Trade-off**: Data resets on server restart

### Component Architecture
- **Separation of Concerns**: Components are focused and reusable
- **Context API**: Manages global cart state without prop drilling
- **CSS Modules**: Scoped styling prevents conflicts
- **Custom Hooks**: Encapsulate reusable logic

## Testing Strategy

### Backend Tests (26 test cases)
- Menu API endpoint tests
- Order creation and retrieval tests
- Validation tests (input validation)
- Error handling tests
- Edge case tests

### Frontend Tests
- Component rendering tests
- User interaction tests
- Cart functionality tests
- Form validation tests
- Order status display tests

## Features Implemented

✅ Menu display with high-quality images  
✅ Add items to cart with quantity selection  
✅ View and manage cart items  
✅ Checkout form with validation  
✅ Order placement with API integration  
✅ Order tracking with real-time status updates  
✅ Automatic status transitions (simulated)  
✅ Responsive design  
✅ Backend API with validation  
✅ Comprehensive test coverage  

## Deployment

### Backend (Vercel/Render/Railway)
The backend can be deployed to any Node.js hosting platform.

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set the root directory to `frontend`
3. Configure environment variables if needed
4. Deploy!

## Future Improvements

- [ ] User authentication and order history
- [ ] Payment integration (Stripe)
- [ ] Admin dashboard for managing orders
- [ ] Push notifications for status updates
- [ ] Rate limiting and API security
- [ ] Database persistence (MongoDB/PostgreSQL)
- [ ] Image upload for menu items
- [ ] Search and filter for menu items
- [ ] Order cancellation feature

## License

MIT

## Author

Built as part of the Order Management feature assignment.

## AI Usage in Development

This project leveraged AI tools for:
- Code generation and boilerplate creation
- Test case generation
- Debugging and troubleshooting
- Documentation assistance
- Architecture planning

AI helped accelerate development while maintaining code quality and best practices.