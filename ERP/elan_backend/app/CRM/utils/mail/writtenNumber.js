function numberToWordsIndian(num) {
  if (num === 0) return "Zero Only";

  const ones = [
    "", "One", "Two", "Three", "Four", "Five",
    "Six", "Seven", "Eight", "Nine", "Ten",
    "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen",
    "Sixteen", "Seventeen", "Eighteen", "Nineteen"
  ];

  const tens = [
    "", "", "Twenty", "Thirty", "Forty", "Fifty",
    "Sixty", "Seventy", "Eighty", "Ninety"
  ];

  const scales = [
    "", "Thousand", "Lakh", "Crore", "Arab", "Kharab", "Neel", "Padma", "Shankh"
  ];

  function twoDigits(n) {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    let t = Math.floor(n / 10);
    let o = n % 10;
    return tens[t] + (o ? " " + ones[o] : "");
  }

  function threeDigits(n) {
    if (n === 0) return "";
    let h = Math.floor(n / 100);
    let r = n % 100;
    let str = "";
    if (h > 0) str += ones[h] + " Hundred";
    if (r > 0) str += (str ? " " : "") + twoDigits(r);
    return str;
  }

  function splitNumber(n) {
    let parts = [];
    parts.push(n % 1000); 
    n = Math.floor(n / 1000);

    while (n > 0) {
      parts.push(n % 100); 
      n = Math.floor(n / 100);
    }

    return parts;
  }

  function convertInteger(n) {
    if (n === 0) return "Zero";
    let parts = splitNumber(n);
    let words = [];

    for (let i = parts.length - 1; i >= 0; i--) {
      if (parts[i]) {
        let word = (i === 0) ? threeDigits(parts[i]) : twoDigits(parts[i]);
        if (word) {
          words.push(word + (scales[i] ? " " + scales[i] : ""));
        }
      }
    }

    return words.join(" ").trim();
  }

  // ✅ Main Logic
  let [integerPart, decimalPart] = num.toString().split(".");
  integerPart = parseInt(integerPart, 10);
  decimalPart = decimalPart ? parseInt(decimalPart.substring(0, 2), 10) : 0;

  let result = convertInteger(integerPart);

  // if (decimalPart > 0) {
  //   result += " And " + convertInteger(decimalPart) + " Paise";
  // }

  // return result + " Only";
 
  result += " Rupees and " + convertInteger(decimalPart) + " Paise Only";
  return result;
}




module.exports = numberToWordsIndian;