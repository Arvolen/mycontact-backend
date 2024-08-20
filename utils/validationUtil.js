const validateRegisterInput = (input) => {
    const { firstName, lastName, username, email, password } = input;
    if (!firstName || !lastName || !username || !email || !password) {
        throw new Error("All fields are mandatory");
    }
};

const validateLoginInput = (input) => {
    const { email, password } = input;
    if (!email || !password) {
        throw new Error("All fields are mandatory");
    }
};

module.exports = {
    validateRegisterInput,
    validateLoginInput,
};
