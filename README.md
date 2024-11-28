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
