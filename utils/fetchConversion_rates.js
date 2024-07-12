const fetchConversion_rates = async () => {
  let curr1ToCurr2 = {};
  try {
    const response = await fetch(`${process.env.CONVERSION_RATES}`);
    // console.log(process.env.CONVERSION_RATES);
    const result = await response.json();

    curr1ToCurr2 = result.conversion_rates;
    //   console.log('success');
    return curr1ToCurr2;
    //   const curr = "USD";
    //   const converted = curr1ToCurr2[curr];
    //   // console.log(converted);
  } catch (error) {
    console.error(error);
  }

  // const url = `https://currency-converter18.p.rapidapi.com/api/v1/convert?from=USD&to=INR&amount=1`;
  // const options = {
  //   method: "GET",
  //   headers: {
  //     "x-rapidapi-key":
  //       "a407d4a0f9msh65830e58be2441ap163368jsnd55aa9e7f2d9",
  //     "x-rapidapi-host": "currency-converter18.p.rapidapi.com",
  //   },
  // };

  // try {
  //   const response = await fetch(url, options);
  //   const result = await response.text();
  //   console.log(result);
  //   usdToInr=result
  // } catch (error) {
  //   console.error(error);
  // }
};

module.exports = fetchConversion_rates;
