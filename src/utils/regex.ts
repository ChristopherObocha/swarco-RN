export const capitalsRegex = /([A-Z]+)/;

// Email regex validates the following
// 1. Must contain @
// 2. Must contain .
// 3. Must not contain spaces
export const emailRegex =
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const numbersRegex = /^(\d{11})$/;
export const onlyNumbersRegex = /^\d+$/;

// Password regex validates the following
// - must be at least 12 characters long.
// - must contain at least one lowercase letter.
// - must contain at least one uppercase letter.
// - must contain at least one digit.
// - must contain at least one special character. The special characters are represented ?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/]
// - must contain at least one currency symbol. The currency symbols are £, $, €, ¥, ₹, ₽, ₺, ₸, ₵, ₴, ₣, ₲, ₾, ₼, ₿, ₶, ₷, ₰, ₱, ₳, ₨, ₪, ₯, ₠, ₡, ₢, ₣, ₤, ₥, ₦, ₧, ₨, ₩, ₫, ₭, ₮, ₻.
// - must not contain three or more consecutive identical characters.
export const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/£$€¥₹₽₺₸₵₴₣₲₾₼₿₶₷₰₱₳₨₪₯₠₡₢₣₤₥₦₧₨₩₫₭₮₻])(?!.*(.)\1\1).{12,}$/;
// Phone number regex validates mobile numbers
export const phoneNumberRegex = /^[+]?(?:[0-9\-\(\)\/\.]\s?){6,15}[0-9]{1}$/;

export const specialRegex =
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
export const lettersRegex = /^[a-zA-Z\s]*$/;

// The below regex checks that the input is alphanumeric and not just spaces
export const alphanumericRegex = /^(?=.*\S)[a-zA-Z0-9\s.,]+$/;

// Checks the following
// 1. Must not be just spaces
// 2. Must not start with a space
// 3. Must not end with a space
export const notEmptyRegex = /^\S.*\S$|^$/;

export const postcodeRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9\s]{1,9}[a-zA-Z0-9])?$/;
