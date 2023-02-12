const fs = require('fs/promises');
const path = require('path');
const contactsPath = path.join(__dirname, 'contacts.json');

const listContacts = async () => {
  return JSON.parse(await fs.readFile(contactsPath, 'utf-8'));
};

const getContactById = async contactId => {
  return await listContacts().then(data => data.find(el => el.id === contactId));
};

const removeContact = async contactId => {
  const contactsList = await listContacts();
  const newContacts = contactsList.filter(el => el.id !== contactId);
  if (newContacts.length === contactsList.length) {
    return null;
  }
  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  return { message: 'contact deleted' };
};

const addContact = async body => {
  const contacts = await listContacts();
  const newContact = {
    id: `${+(contacts[contacts.length - 1].id ?? 0) + 1}`,
    ...body,
  };
  await fs.writeFile(contactsPath, JSON.stringify([...contacts, newContact], null, 2));
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contact = {
    ...(await getContactById(contactId)),
    ...body,
  };
  const validId = await removeContact(contactId);
  if (!validId) {
    return validId;
  }
  await fs.writeFile(contactsPath, JSON.stringify([...(await listContacts()), contact], null, 2));
  return contact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
