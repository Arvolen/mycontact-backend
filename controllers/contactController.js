const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel"); // Adjust the path as necessary

//@desc Get all contacts
//@route GET /api/contacts
//@access private
const getContacts = asyncHandler(async (req, res) => {
    const contacts = await Contact.findAll({ where: { user_id: req.user.id } });
    res.status(200).json(contacts);
});

//@desc Create new contact
//@route POST /api/contacts
//@access private
const createContact = asyncHandler(async (req, res) => {
    console.log("The request body is:", req.body);
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        res.status(400);
        throw new Error("All fields are mandatory");
    }

    const contact = await Contact.create({
        name,
        email,
        phone,
        user_id: req.user.id,
    });

    res.status(201).json(contact);
});

//@desc Get contact
//@route GET /api/contacts/:id
//@access private
const getContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    res.status(200).json(contact);
});

//@desc Update contact
//@route PUT /api/contacts/:id
//@access private
const updateContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission");
    }

    const updatedContact = await Contact.update(req.body, {
        where: { id: req.params.id },
        returning: true,
        plain: true
    });

    res.status(200).json(updatedContact[1]);
});

//@desc Delete contact
//@route DELETE /api/contacts/:id
//@access private
const deleteContact = asyncHandler(async (req, res) => {
    const contact = await Contact.findByPk(req.params.id);

    if (!contact) {
        res.status(404);
        throw new Error("Contact not found");
    }

    if (contact.user_id !== req.user.id) {
        res.status(403);
        throw new Error("User doesn't have permission");
    }

    await contact.destroy();

    res.status(200).json(contact);
});

module.exports = { getContacts, createContact, getContact, updateContact, deleteContact };
