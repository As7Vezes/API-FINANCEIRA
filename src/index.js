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

    console.log(custumers);
    return res.status(201).send();
});

app.get("/statement", verifyIfExistsAccountCPF, (req, res) => {
    const { customer } = req;
    return res.json(customer.statement);
})

const port = 3000;

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
});