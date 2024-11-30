const TransactionTable = ({ transactions }) => {
  if (!transactions.length)
    return <p className="text-gray-500 italic">No transactions found.</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-6xl mx-auto">
      <h2 className="text-xl font-bold text-gray-700 mb-4">All Transactions</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-4 py-2 border border-gray-200">Date</th>
              <th className="px-4 py-2 border border-gray-200">Type</th>
              <th className="px-4 py-2 border border-gray-200">Amount</th>
              <th className="px-4 py-2 border border-gray-200">Category</th>
              <th className="px-4 py-2 border border-gray-200">Description</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr
                key={transaction._id}
                className="even:bg-gray-50 hover:bg-gray-100"
              >
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center capitalize">
                  {transaction.type}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-right">
                  ₹{transaction.amount.toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-200 text-center">
                  {transaction.category}
                </td>
                <td className="px-4 py-2 border border-gray-200">
                  {transaction.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
