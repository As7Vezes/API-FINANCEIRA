const express = require("express");
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

const custumers = [];

function verifyIfExistsAccountCPF (req, res, next) {
    const { cpf } = req.headers;

    const customer = custumers.find(customer => customer.cpf === cpf);

    if(!customer) {
        return res.status(400).json({ error: "Custumer not found!" })
    }

    req.customer = customer;

    return next();

}

function getBalance (statement) {
    const balance = statement.reduce((acc, operation) => {
        if(operation.type === "credit") {
            return acc + operation.amount;
        } else {
            return acc - operation.amount;
        }
    }, 0);

    return balance;
}

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const cpfExist = custumers.some(constumer => constumer.cpf === cpf)

    if(cpfExist) {
        res.status(400).json({ error: "Customer already Exists!" })
    }

    custumers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    return res.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req;
    return res.json(customer.statement);
})

app.post("/deposit", verifyIfExistsAccountCPF, (req, res) => {
    const { description, amount } = req.body;

    const { customer } = req;

    const statementOperation = {
        description,
        amount,
        created_at: new Date(),
        type: "credit"
    };

    customer.statement.push(statementOperation);

    console.log(customer.statement)

    return res.status(201).send();

})

app.post("/withdraw", verifyIfExistsAccountCPF, (req, res) => {
    const { amount } = req.body;

    const { customer } = req;

    const balance = getBalance(customer.statement);

    if(balance < amount) {
        return res.status(400).json({ error: "Insufficient funds!" })
    }

    const statementOperation = {
        amount,
        created_at: new Date(),
        type: "debit"
    }

    customer.statement.push(statementOperation);

    return res.status(201).send();
})

const port = 3000;

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
});