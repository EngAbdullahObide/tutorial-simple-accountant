import models from "../models";

export const toWallet = async (req, res) => {
    const {date, name, quantity} = req.body;

    try {
        const wallet = await models.Wallet.create({
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
export const fromWallet = async (req, res) => {
    const id =  req.currentUser.id;
    try {
         const wallet =await models.Wallet.findAll({
            where: { _id: id.toString() },
         });
        res.status(200).json(wallet);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}
export const deleteWallet = async (req, res) => {
    const id =  req.currentUser.id;
    try {
         const wallet =await models.Wallet.destroy({
            where: { _id: id.toString(), id: req.params.id},
         });
        res.status(200).json(wallet);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}
