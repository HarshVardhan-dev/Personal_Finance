## Features Implemented

1. **Add Entry**

   - Endpoint: `POST /api/transactions`
   - Description: Adds a new income or expense transaction to the database.

2. **Edit Entry**

   - Endpoint: `PUT /api/transactions/:id`
   - Description: Edits an existing transaction by updating its details.

3. **Delete Entry**
   - Endpoint: `DELETE /api/transactions/:id`
   - Description: Deletes an existing transaction from the database.
4. **Get All Transactions**

   - Endpoint: `GET /api/transactions`
   - Description: Fetches all transactions, with optional filters for date range and category.
   - Example Filters:
     - `GET /api/transactions?startDate=2024-11-01&endDate=2024-11-30`
     - `GET /api/transactions?category=Groceries`

5. **Filters and Pagination**

   - Endpoint: `GET /api/transactions/filter`
   - Description: Fetches transactions with optional filters and pagination.
   - Query Parameters:
     - `type`: Filter by transaction type (income/expense).
     - `category`: Filter by category (e.g., Salary, Groceries).
     - `minAmount` and `maxAmount`: Filter by amount range.
     - `page`: Page number for pagination (default: 1).
     - `limit`: Number of items per page (default: 10).
   - Example Queries:
     - `GET /api/transactions/filter?page=1&limit=5`
     - `GET /api/transactions/filter?type=income&category=Salary`
     - `GET /api/transactions/filter?minAmount=500&maxAmount=2000`

6. **Export Data**
   - Export transactions as CSV or PDF.
   - Endpoints:
     - `GET /api/transactions/export/csv?startDate=<date>&endDate=<date>`
     - `GET /api/transactions/export/pdf?startDate=<date>&endDate=<date>`
   - Query Parameters:
     - `startDate`: Start of the date range (optional).
     - `endDate`: End of the date range (optional).
