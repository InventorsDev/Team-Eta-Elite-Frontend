export function formatToNaira(value) {
    if (value === null || value === undefined || value === "") return "";
  
    // Convert to string and remove non-digit characters
    const numStr = String(value).replace(/\D/g, "");
  
    if (numStr.length === 0) return "₦0";
  
    // Reverse the string to insert commas from the right
    const reversed = numStr.split("").reverse();
    const withCommas = [];
  
    for (let i = 0; i < reversed.length; i++) {
      withCommas.push(reversed[i]);
      if ((i + 1) % 3 === 0 && i !== reversed.length - 1) {
        withCommas.push(",");
      }
    }
  
    return "₦" + withCommas.reverse().join("");
  }
  