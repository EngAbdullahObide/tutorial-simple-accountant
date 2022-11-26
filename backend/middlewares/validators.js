export const SaveUser = (req, res) => {
    req.checkBody('name')
        .notEmpty()
        .withMessage("Name is required");

    req.checkBody('email')
        .notEmpty()
        .withMessage("Email is required");

    req.checkBody('email')
        .isEmail()
        .withMessage("Email is not correct");

    req.checkBody('password')
        .notEmpty()
        .withMessage("Password is required");
};
export const SaveWallet = (req, res) => {
    req.checkBody('date')
        .notEmpty()
        .withMessage("Date is required");

    req.checkBody('name')
        .notEmpty()
        .withMessage("Name is required");

    req.checkBody('quantity')
        .notEmpty()
        .withMessage("Quantity is required");
};

export const SaveSafe = (req, res) => {
    req.checkBody('date')
        .notEmpty()
        .withMessage("Date is required");

    req.checkBody('name')
        .notEmpty()
        .withMessage("Name is required ");

    req.checkBody('quantity')
        .notEmpty()
        .withMessage("Quantity is required ");
};

export const SaveExpenses = (req, res) => {
    req.checkBody('date')
        .notEmpty()
        .withMessage("Date is required ");

    req.checkBody('name')
        .notEmpty()
        .withMessage("Name is required ");

    req.checkBody('quantity')
        .notEmpty()
        .withMessage("Quantity is required");
};
