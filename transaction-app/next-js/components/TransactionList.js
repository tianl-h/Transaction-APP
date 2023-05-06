import { useState, useEffect } from 'react';

function TransactionList() {
  const [transactions, setTransactions] = useState([]);

  const initialTransactions = [
    {
      amount: 100,
      category: 'Groceries',
      date: '2022-05-01',
      description: 'Weekly grocery shopping'
    },
    {
      amount: 50,
      category: 'Eating out',
      date: '2022-05-03',
      description: 'Dinner with friends'
    },
    {
      amount: 200,
      category: 'Shopping',
      date: '2022-05-05',
      description: 'New clothes'
    }
  ];

  useEffect(() => {
    const storedTransactions = localStorage.getItem('transactions');
    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions));
    } else {
      setTransactions(initialTransactions);
      localStorage.setItem('transactions', JSON.stringify(initialTransactions));
    }
  }, []);

  const [newTransaction, setNewTransaction] = useState({
    amount: '',
    category: '',
    date: '',
    description: ''
  });

  const [summary, setSummary] = useState(null);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setNewTransaction(prevTransaction => ({ ...prevTransaction, [name]: value }));
  };

  const handleAddTransaction = event => {
    event.preventDefault();
    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
    setNewTransaction({
      amount: '',
      category: '',
      date: '',
      description: ''
    });
  };

  const handleDeleteTransaction = date => {
    const updatedTransactions = transactions.filter(transaction => transaction.date !== date);
    setTransactions(updatedTransactions);
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const summarizeBy = field => {
    return transactions.reduce((summary, transaction) => {
      const fieldValue = transaction[field];
      if (!summary.hasOwnProperty(fieldValue)) {
        summary[fieldValue] = 0;
      }
      summary[fieldValue] += transaction.amount;
      return summary;
    }, {});
  };

  const summarizeByDate = () => {
    const summary = transactions.reduce((summary, transaction) => {
      const date = transaction.date;
      if (!summary.hasOwnProperty(date)) {
        summary[date] = 0;
      }
      summary[date] += parseInt(transaction.amount);
      return summary;
    }, {});
  
    const rows = Object.keys(summary).map(date => (
      <tr key={date}>
        <td>{date}</td>
        <td>{summary[date]}</td>
      </tr>
    ));
  
    return (
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };  

  const summarizeByMonth = () => {
    const summary = transactions.reduce((summary, transaction) => {
      const month = transaction.date.substring(0, 7);
      if (!summary.hasOwnProperty(month)) {
        summary[month] = 0;
      }
      summary[month] += parseInt(transaction.amount);
      return summary;
    }, {});
  
    const rows = Object.keys(summary).map(month => (
      <tr key={month}>
        <td>{month}</td>
        <td>{summary[month]}</td>
      </tr>
    ));
  
    return (
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };  
  

  const summarizeByYear = () => {
    const summary = transactions.reduce((summary, transaction) => {
      const year = transaction.date.substring(0, 4);
      const amount = parseInt(transaction.amount);
      if (!summary.hasOwnProperty(year)) {
        summary[year] = 0;
      }
      summary[year] += amount;
      return summary;
    }, {});
    const rows = Object.keys(summary).map(year => (
      <tr key={year}>
        <td>{year}</td>
        <td>{summary[year]}</td>
      </tr>
    ));
    return (
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };
  

  const summarizeByCategory = () => {
    const summary = transactions.reduce((summary, transaction) => {
      const category = transaction.category;
      if (!summary.hasOwnProperty(category)) {
        summary[category] = 0;
      }
      summary[category] += parseInt(transaction.amount);
      return summary;
    }, {});
    const rows = Object.keys(summary).map(category => (
      <tr key={category}>
        <td>{category}</td>
        <td>{summary[category]}</td>
      </tr>
    ));
    return (
      <table>
        <thead>
          <tr>
            <th>Category</th>
            <th>Total Amount</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  };
  
  

return (
<ul className="transaction-list">
<h1>Transactions</h1>
<ul>
<table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Amount</th>
            <th>Category</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
{transactions.map(transaction => (
 <tr key={transaction.date}>
 <td>{transaction.date}</td>
 <td>{transaction.amount}</td>
 <td>{transaction.category}</td>
 <td>{transaction.description}</td>
 <td>
   <button onClick={() => handleDeleteTransaction(transaction.date)}>Delete</button>
 </td>
</tr>
))}
</tbody>
 </table>
</ul>
<h2>Add Transaction</h2>
<form onSubmit={handleAddTransaction}>
<label>
Amount:
<input type="number" name="amount" value={newTransaction.amount} onChange={handleInputChange} />
</label>
<label>
Category:
<input type="text" name="category" value={newTransaction.category} onChange={handleInputChange} />
</label>
<label>
Date:
<input type="date" name="date" value={newTransaction.date} onChange={handleInputChange} />
</label>
<label>
Description:
<input type="text" name="description" value={newTransaction.description} onChange={handleInputChange} />
</label>
<button type="submit">Add</button>
</form>
<h2>Summarize Transactions</h2>
<button onClick={() => setSummary(summarizeByDate())}>By Date</button>
<button onClick={() => setSummary(summarizeByMonth())}>By Month</button>
<button onClick={() => setSummary(summarizeByYear())}>By Year</button>
<button onClick={() => setSummary(summarizeByCategory())}>By Category</button>
{summary && <div>{summary}</div>}
</ul>
);
}

export default TransactionList;
