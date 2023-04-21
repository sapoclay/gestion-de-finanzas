// array inicial para las transacciones, y para leer del almacenaje local
let transactions = JSON.parse(localStorage.getItem('transactions')) || [];

// función para añadir una nueva transacción
const addTransaction = (e) => {
    e.preventDefault();

    // obtener tipo, nombre y cantidad
    let type = document.getElementById('type').value;
    let name = document.getElementById('name').value;
    let amount = Number(document.getElementById('amount').value.replace(',', '.'));

    // isNaN para comprobar si el número es un valor válido
    if (type != 'Seleccion' && name.trim() !== '' && !isNaN(amount) && amount > 0) {
        const transaction = {
            type,
            name,
            //  toLocaleString para convertir el número en una cadena con separador decimal adecuado antes de agregarlo a la transacción
            amount: amount.toLocaleString('es-ES', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }),
            id: transactions.length > 0 ? transactions[transactions.length - 1].id + 1 : 1,
            date: new Date().toLocaleDateString('es-ES') // añadir la fecha actual
        }

        transactions.push(transaction);
        // almacenaje local 
        localStorage.setItem('transactions', JSON.stringify(transactions));

        document.getElementById('expForm').reset();
        showTransactions();
        updateBalance();
    } else {
        alert('Rellena los campos correctamente!!');
    }
}

// función para mostrar las transacciones en la tabla
const showTransactions = () => {
    const transactionTable = document.getElementById('transactionTable');
    transactionTable.innerHTML = '';

    for (let i = 0; i < transactions.length; i++) {
        transactionTable.innerHTML += `
            <tr>
                <td>${transactions[i].type}</td>
                <td>${transactions[i].name}</td>
                <td>${transactions[i].amount.replace('.', ',')} €</td>
                <td>${transactions[i].date}</td> 
                <td><a id="deleteBtn_${transactions[i].id}" class="deleteButton" title="Borrar transacción" onclick="confirmDelete(${transactions[i].id})">Borrar</td>
            </tr>
        `;
    }
}

// confirmación de la eliminación
const confirmDelete = (id) => {
    const result = confirm("¿Estás seguro de que deseas eliminar esta transacción?");

    if (result) {
        deleteTransaction(id);
    }
}

// función para eliminar la transacción
const deleteTransaction = (id) => {
    transactions = transactions.filter((transaction) => transaction.id !== id);
    localStorage.setItem('transactions', JSON.stringify(transactions));
    showTransactions();
    updateBalance();
}

// función para actualizar el balance
const updateBalance = () => {
    let balance = 0;

    transactions.forEach((transaction) => {
        let amount = Number(transaction.amount.replace(',', '.'));
        // se usa isNaN para comprobar si el valor de la cantidad es un número válido
        if (!isNaN(amount)) {
            if (transaction.type === "Ingreso") {
                balance += amount;
            } else if (transaction.type === "Gasto") {
                balance -= amount;
            }
        }
    });

    //  asegura que el balance se muestre correctamente en el formato localizado, 
    //  con la separación de miles y decimales adecuada para el idioma y la región seleccionados
    document.querySelector(".balance").textContent = balance.toLocaleString('es-ES', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// añadir un evento listener al formulario
document.getElementById('expForm').addEventListener('submit', addTransaction);

// mostrar las transacciones y actualizar el balance al recargar la página
showTransactions();
updateBalance();

