const express = require("express");
const { v4: uuidv4 } = require("uuid")

const app = express();

app.use(express.json());

const constumers = [];

app.post("/account", (req, res) => {
    const { cpf, name } = req.body;

    const cpfExist = constumers.some(constumer => constumer.cpf === cpf)

    if(cpfExist) {
        res.status(400).json({ error: "Customer already Exists!" })
    }

    constumers.push({
        cpf,
        name,
        id: uuidv4(),
        statement: []
    });

    console.log(constumers);
    return res.status(201).send();
});

const port = 3000;

app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`)
});