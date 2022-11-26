import models from "../models";

export const toExpenses = async (req, res) => {
    const { date, name, quantity} = req.body;

    try {
        const expenses = await models.Expenses.create({
            _id: req.currentUser.id,
            date,
            name,
            quantity
        })
        res.status(200).json({ message: 'Secsses' });
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}

export const fromExpenses = async (req, res) => {
    const id =  req.currentUser.id;
    try {
         const expenses =await models.Expenses.findAll({
            where: { _id: id.toString() },
         });
        res.status(200).json(expenses);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}

export const deleteExpenses = async (req, res) => {
    const id =  req.currentUser.id;
    try {
         const expenses =await models.Expenses.destroy({
            where: { _id: id.toString(), id: req.params.id},
         });
        res.status(200).json(expenses);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}
