function stylizePhoneNumber(phoneNumber) {
  if (!phoneNumber) {
    return {
      phone: undefined,
      stylizedPhone: undefined
    }
  }

  let num = phoneNumber.replace(/\D/g,'')

  if (num.length < 10 || num.length > 11) {
    return {
      phone: num,
      stylizedPhone: undefined
    }
  }

  if (num.length == 10) {
    let areaCode = num.substring(0, 3)
    let firstThree = num.substring(3, 6)
    let lastFour = num.substring(6, 10)
    return {
      phone: num,
      stylizedPhone: "1+" + " (" + areaCode + ") " + firstThree + "-" + lastFour
    }
  }

  if (num.length == 11) {
    let areaCode = num.substring(1, 4)
    let firstThree = num.substring(4, 7)
    let lastFour = num.substring(7, 11)
    return {
      phone: num,
      stylizedPhone: "1+" + " (" + areaCode + ") " + firstThree + "-" + lastFour
    }
  }
}

module.exports = stylizePhoneNumber
