const Modal = {
    onOff() {
        document.querySelector('.modal-overlay')
                .classList
                .toggle('active')
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem('finances:transactions')) || []
    },

    set(transactions) {
        localStorage.setItem('finances:transactions', JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),

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

        this.all.forEach(transaction => {
            if (transaction.amount > 0) {
                income += transaction.amount
            }
        })        

        return income
    },

    expenses(){
        let expense = 0

        this.all.forEach(transaction => {
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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionContainer.appendChild(tr)   
    },

    innerHTMLTransaction(transaction, index) {
        const CSSclass = transaction.amount > 0 ? 'income' : 'expense'

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
        <td class="description">${transaction.description}</td>
        <td class="${CSSclass}">${amount}</td>
        <td class="date">${transaction.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover transação">
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
    formatAmount(value) {
        //value => string
        value = Number(value) * 100

        return Math.round(value)
    },

    formatDate(value) {
        const splittedDate = value.split('-')

        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    },

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

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues() {
        return {
            description: this.description.value,
            amount: this.amount.value,
            date: this.date.value
        }
    },
    
    validateFields() {
        const {description, amount, date} = this.getValues()

        if(description.trim() == '' || amount.trim() == '' || date.trim() == '') {
            throw new Error("Por favor, preencha todos os campos")
        }
    },

    formatValues() {
        let {description, amount, date} = this.getValues()

        amount = Utils.formatAmount(amount)

        date = Utils.formatDate(date)

        return {
            description,
            amount,
            date
        }
    },

    clearFields() {
        this.description.value = ''
        this.amount.value = ''
        this.date.value = ''
    },
    
    submit(event) {
        event.preventDefault()

        try {
            this.validateFields()

            const transaction = this.formatValues()
            Transaction.add(transaction)

            this.clearFields()

            Modal.onOff()

        } catch (error) {
            alert(error.message)
        }
    }
}

const App = {
    init() {
     
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

        Storage.set(Transaction.all)
    },
    reload(){
        DOM.clearTransaction()
        
        this.init()
    }
}

App.init()