const validateRegisterInput = (input) => {
    const { name, username, email, password } = input;
    if (!name || !username || !email || !password) {
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
