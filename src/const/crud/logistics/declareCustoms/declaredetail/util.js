export function convertCurrency(currencyDigits) {
  // Constants:
  var MAXIMUM_NUMBER = 99999999999.99
  // Predefine the radix characters and currency symbols for output:
  var CN_ZERO = "零"
  var CN_ONE = "壹"
  var CN_TWO = "贰"
  var CN_THREE = "叁"
  var CN_FOUR = "肆"
  var CN_FIVE = "伍"
  var CN_SIX = "陆"
  var CN_SEVEN = "柒"
  var CN_EIGHT = "捌"
  var CN_NINE = "玖"
  var CN_TEN = "拾"
  var CN_HUNDRED = "佰"
  var CN_THOUSAND = "仟"
  var CN_TEN_THOUSAND = "万"
  var CN_HUNDRED_MILLION = "亿"
  var CN_SYMBOL = ""
  var CN_DOLLAR = "元"
  var CN_TEN_CENT = "角"
  var CN_CENT = "分"
  var CN_INTEGER = "整"

  // Variables:
  var integral // Represent integral part of digit number.
  var decimal // Represent decimal part of digit number.
  var outputCharacters // The output result.
  var parts
  var digits, radices, bigRadices, decimals
  var zeroCount
  var i, p, d, ds
  var quotient, modulus

  // Validate input string:
  currencyDigits = currencyDigits.toString()
  if (currencyDigits == "") {
    alert("不能为空 请输入数字金额!如：123.23")
    return ""
  }
  if (currencyDigits.match(/[^,.\d]/) != null) {
    alert("输入字符串中的字符无效!")
    return ""
  }
  if (currencyDigits.match(/^((\d{1,3}(,\d{3})*(.((\d{3},)*\d{1,3}))?)|(\d+(.\d+)?))$/) == null) {
    alert("请输入正确的数字金额!")
    return ""
  }

  // Normalize the format of input digits:
  currencyDigits = currencyDigits.replace(/,/g, "") // Remove comma delimiters.
  currencyDigits = currencyDigits.replace(/^0+/, "") // Trim zeros at the beginning.
  // Assert the number is not greater than the maximum number.
  if (Number(currencyDigits) > MAXIMUM_NUMBER) {
    alert("Too large a number to convert!")
    return ""
  }

  // Process the coversion from currency digits to characters:
  // Separate integral and decimal parts before processing coversion:
  parts = currencyDigits.split(".")
  if (parts.length > 1) {
    integral = parts[0]
    decimal = parts[1]
    // Cut down redundant decimal digits that are after the second.
    decimal = decimal.substr(0, 2)
  } else {
    integral = parts[0]
    decimal = ""
  }
  // Prepare the characters corresponding to the digits:
  digits = new Array(CN_ZERO, CN_ONE, CN_TWO, CN_THREE, CN_FOUR, CN_FIVE, CN_SIX, CN_SEVEN, CN_EIGHT, CN_NINE)
  radices = new Array("", CN_TEN, CN_HUNDRED, CN_THOUSAND)
  bigRadices = new Array("", CN_TEN_THOUSAND, CN_HUNDRED_MILLION)
  decimals = new Array(CN_TEN_CENT, CN_CENT)
  // Start processing:
  outputCharacters = ""
  // Process integral part if it is larger than 0:
  if (Number(integral) > 0) {
    zeroCount = 0
    for (i = 0; i < integral.length; i++) {
      p = integral.length - i - 1
      d = integral.substr(i, 1)
      quotient = p / 4
      modulus = p % 4
      if (d == "0") {
        zeroCount++
      } else {
        if (zeroCount > 0) {
          outputCharacters += digits[0]
        }
        zeroCount = 0
        outputCharacters += digits[Number(d)] + radices[modulus]
      }
      if (modulus == 0 && zeroCount < 4) {
        outputCharacters += bigRadices[quotient]
      }
    }
    outputCharacters += CN_DOLLAR
  }
  // Process decimal part if there is:
  if (decimal != "") {
    for (i = 0; i < decimal.length; i++) {
      d = decimal.substr(i, 1)
      ds = decimal.substr(-1, 1)
      if (d == 0) {
        if (ds == 0) {
          outputCharacters += ""
        } else {
          outputCharacters += digits[Number(d)]
        }
      } else {
        outputCharacters += digits[Number(d)] + decimals[i]
      }
    }
  }
  // Confirm and return the final output string:
  if (outputCharacters == "") {
    outputCharacters = CN_ZERO + CN_DOLLAR
  }
  if (decimal == "") {
    outputCharacters += CN_INTEGER
  }
  outputCharacters = CN_SYMBOL + outputCharacters
  return outputCharacters
}

//时间格式化函数，此处仅针对yyyy-MM-dd hh:mm:ss 的格式进行格式化
export function dateFormat(time) {
  if (!time) {
    return ""
  }
  var date = new Date(time)
  var year = date.getFullYear()
  /* 在日期格式中，月份是从0开始的，因此要加0
   * 使用三元表达式在小于10的前面加0，以达到格式统一  如 09:11:05
   * */
  var month = date.getMonth() + 1
  //var month= date.getMonth()+1<10 ? "0"+(date.getMonth()+1) : date.getMonth()+1;
  var day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate()
  //var hours=date.getHours()<10 ? "0"+date.getHours() : date.getHours();
  //var minutes=date.getMinutes()<10 ? "0"+date.getMinutes() : date.getMinutes();
  //var seconds=date.getSeconds()<10 ? "0"+date.getSeconds() : date.getSeconds();
  // 拼接
  return year + "/" + month + "/" + day //+" "+hours+":"+minutes+":"+seconds
}
