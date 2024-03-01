export function validateName(name) {
  return /^[A-Za-z\s]+$/.test(name);
}

export function validatePhoneNumber(number) {
  return /^\+?[1-9]\d{1,14}$/.test(number);
}

export function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateAddress(address) {
  return address.length > 5;
}

export function validateCountryOrState(input) {
  return input.trim() !== '';
}

export function validateCity(city) {
  return /^[A-Za-z\s]+$/.test(city);
}

export function validateZip(zip) {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

export function validateEthereumWalletAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
