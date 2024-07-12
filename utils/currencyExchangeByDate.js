const currencyExchangeByDate = async (transaction_date, currency) => {
  let curr1ToCurr2 = {};
  //   console.log(transaction_date);
  const url = `${process.env.CURRENCY_EXCHANGE_BY_DATE}/${transaction_date}?from=${currency}&to=INR%2CGBP`;
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "fbc4b9c9d5msha5686ffd45ef294p134d89jsne5739f53eb4f",
      "x-rapidapi-host":
        "currency-conversion-and-exchange-rates.p.rapidapi.com",
    },
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();
    // console.log(result);
    curr1ToCurr2 = result.rates;
    // console.log(curr1ToCurr2);
    return curr1ToCurr2;
  } catch (error) {
    console.error(error);
  }
};

module.exports = currencyExchangeByDate;
