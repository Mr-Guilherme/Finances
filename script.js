const buttonNew = document.querySelector("a.button.new")
const buttonCancel = document.querySelector("a.button.cancel")
const form = document.querySelector(".modal-overlay")

buttonNew.addEventListener("click", toggle)
buttonCancel.addEventListener("click", toggle)

function toggle() {
    form.classList.toggle("active")
}

const transactions = [
    {
        description: 'Site',
        amount: 600000,
        date: '25/01/2021'
    },
    {
        description: 'Luz',
        amount: -40000,
        date: '10/01/2021'
    },
    {
        description: 'Internet',
        amount: -25000,
        date: '02/01/2021'
    },
    {
        description: 'Aluguel',
        amount: -95000,
        date: '01/01/2021'
    },
]

const Transaction = {
    all: transactions,

    add(transaction) {
        this.all.push(transaction)

        App.reload()
    },

    remove(index) {
        this.all.splice(index, 1)

        App.reload()
    },

    incomes(){
        let income = 0

        transactions.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })        

        return income
    },

    expenses(){
        let expense = 0

        transactions.forEach(transaction => {
            if (transaction.amount < 0) {
                expense += transaction.amount
            }
        })        

        return expense
    },

    total(){
        return this.incomes() + this.expenses()
    }
}

const DOM = {
    transactionContainer: document.querySelector('#data-table tbody'),

    addTransaction(transaction, index) {
        const tr = document.createElement('tr')
        tr.innerHTML = this.innerHTMLTransaction(transaction)

        this.transactionContainer.appendChild(tr)   
    },

    innerHTMLTransaction(transaction) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img src="./assets/minus.svg" alt="Remover transação">
        </td>`

        return html
    },

    updateBalance() {
        const incomeDisplay = document.querySelector('#incomeDisplay')

        incomeDisplay.innerHTML = Utils.formatCurrency(Transaction.incomes())

        const expenseDisplay = document.querySelector('#expenseDisplay')

        expenseDisplay.innerHTML = Utils.formatCurrency(Transaction.expenses())

        const totalDisplay = document.querySelector('#totalDisplay')

        totalDisplay.innerHTML = Utils.formatCurrency(Transaction.total())

    },

    clearTransaction(){
        this.transactionContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? '-' : ''

        value = String(value).replace(/\D/g, '')

        value = Number(value) / 100

        value = value.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL'
        })

        return signal + value
    }
}

const App = {
    init() {
     
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()

    },
    reload(){
        DOM.clearTransaction()
        
        this.init()
    }
}

App.init()

Transaction.add({
    description: 'App',
    amount: 1000000,
    date: '15/12/2020'
})



