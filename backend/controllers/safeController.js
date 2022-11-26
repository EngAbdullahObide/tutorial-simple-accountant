import models from "../models";

export const toSafe = async (req, res) => {
    const { date, name, quantity} = req.body;

    try {
        const safe = await models.Safe.create({
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
export const fromSafe = async (req, res) => {
    const id =  req.currentUser.id;
    try {
         const safe =await models.Safe.findAll({
            where: { _id: id.toString() },
         });
        res.status(200).json(safe);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}

export const deleteSafe = async (req, res) => {
    const id =  req.currentUser.id;
    try {
         const safe =await models.Safe.destroy({
            where: { _id: id.toString(), id: req.params.id},
         });
        res.status(200).json(safe);
    } catch (e) {
        console.log(e);
        res.status(500).json(e);
    }
}
