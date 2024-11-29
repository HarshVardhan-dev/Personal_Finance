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

7. The `addRecurringTransaction` feature allows users to set up recurring transactions with the following details:

- **Type**: Specifies if the transaction is an `income` or an `expense`.
- **Amount**: The value of the transaction.
- **Start Date**: The date from which the recurring transaction begins.
- **End Date**: (Optional) The date on which the recurring transaction ends.
- **Interval**: The frequency of recurrence, such as `daily`, `weekly`, or `monthly`.
- **Category**: The category for the transaction (e.g., Rent, Utilities).
- **Description**: Additional details about the transaction.

### Pre-Creation of Transactions

When a recurring transaction is added:

1. **All transactions are pre-created in the database** for the specified duration (`startDate` to `endDate`).
2. If `endDate` is not provided, transactions are pre-created for one year (configurable).
3. Bulk insertion ensures performance and avoids runtime logic for recurring generation.

### Benefits

- Eliminates the need for runtime transaction generation.
- Ensures transactions are always available for reporting or querying.
- Simplifies recurring transaction logic.

### How to Add Recurring Transactions

Use the `/api/recurringTransactions` POST endpoint:

#### Request Body

```json
{
  "type": "expense",
  "amount": 150,
  "startDate": "2024-11-28",
  "endDate": "2024-12-28",
  "interval": "daily",
  "category": "Utilities",
  "description": "Daily electricity charges"
}
```
