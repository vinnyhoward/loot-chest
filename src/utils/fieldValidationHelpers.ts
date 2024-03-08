export function validateName(name: string) {
  return /^[A-Za-z\s]+$/.test(name);
}

export function validatePhoneNumber(number: string) {
  return /^\+?([1-9][0-9]{0,2})(-?[0-9]{1,3}){0,4}$/.test(number);
}

export function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateAddress(address: string) {
  return address.length > 5;
}

export function validateCountryOrState(input: string) {
  return input.trim() !== '';
}

export function validateCity(city: string) {
  return /^[A-Za-z\s]+$/.test(city);
}

export function validateZip(zip: string) {
  return /^\d{5}(-\d{4})?$/.test(zip);
}

export function validateEthereumWalletAddress(address: string) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}
