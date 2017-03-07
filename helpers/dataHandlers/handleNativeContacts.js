import {handlePhoneNumber} from './'

function handleNativeContacts(contacts) {
  let formattedContacts = []

  for (var c in contacts) {
    let curr = contacts[c]

    // If this contact doesn't have a phone number, skip it
    if (!curr.phoneNumbers || !curr.phoneNumbers[0] || !curr.phoneNumbers[0].number) continue

    // Format contact
    let {phone, stylizedPhone} = handlePhoneNumber(curr.phoneNumbers[0].number)
    let firstName = curr.givenName || ""
    let lastName = curr.familyName || ""
    let contact = {
      phone, stylizedPhone, firstName, lastName,
      initials: firstName.charAt(0).concat(lastName.charAt(0)),
      queryable: firstName.concat(lastName).concat(phone)
    }

    formattedContacts.push(contact)
  }

  return formattedContacts
}

module.exports = handleNativeContacts
