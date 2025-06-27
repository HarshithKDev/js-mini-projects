// Load expenses when page loads
document.addEventListener("DOMContentLoaded", () => {
    loadExpenses();
});

// Add expense function
function addExpense() {
    const expenseInput = document.getElementById("expense");
    const amountInput = document.getElementById("amount");
    const expense = expenseInput.value.trim();
    const amount = parseFloat(amountInput.value.trim());

    // Validation
    if (!expense || isNaN(amount) || amount <= 0) {
        alert("Please enter a valid expense name and amount greater than 0.");
        return;
    }

    // Create expense object
    const timestamp = new Date().toLocaleString();
    const newExpense = { expense, amount, timestamp };

    // Get existing expenses from localStorage
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(newExpense);
    localStorage.setItem("expenses", JSON.stringify(expenses));

    // Clear inputs
    expenseInput.value = "";
    amountInput.value = "";

    // Reload the list
    loadExpenses();
}

// Load and display expenses
function loadExpenses() {
    const list = document.getElementById("expense-list");
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    list.innerHTML = "";

    if (expenses.length === 0) {
        list.innerHTML = '<li class="empty-state">No expenses added yet. Add your first expense above!</li>';
        updateTotal();
        return;
    }

    expenses.forEach((item, index) => {
        const li = document.createElement("li");
        li.innerHTML = `
            <div class="expense-details">
                <strong>${item.expense}: ₹${item.amount.toFixed(2)}</strong>
                <small>${item.timestamp}</small>
            </div>
            <button class="delete-btn" onclick="deleteExpense(${index})">Delete</button>
        `;
        list.appendChild(li);
    });

    updateTotal();
}

// Delete expense function
function deleteExpense(index) {
    if (confirm("Are you sure you want to delete this expense?")) {
        const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
        expenses.splice(index, 1);
        localStorage.setItem("expenses", JSON.stringify(expenses));
        loadExpenses();
    }
}

// Update total amount
function updateTotal() {
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    const total = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
    document.getElementById("total-display").textContent = `Total: ₹${total.toFixed(2)}`;
}

// Add Enter key support for inputs
document.getElementById("expense").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        document.getElementById("amount").focus();
    }
});

document.getElementById("amount").addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        addExpense();
    }
});