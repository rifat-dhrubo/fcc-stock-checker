# User Stories

- Set the content security policies to only allow loading of scripts and CSS from your server.
- I can GET /api/stock-prices with form data containing a Nasdaq stock ticker and recieve back an object stockData.
- In stockData, I can see the stock (the ticker as a string), price (decimal in string format), and likes (int).
- I can also pass along the field like as true (boolean) to have my like added to the stock(s). Only 1 like per IP should be accepted.
- If I pass along 2 stocks, the return object will be an array with information about both stocks. Instead of likes, it will display rel_likes (the difference between the likes) on both.

## Example usage

/api/stock-prices?stock=GOOG

/api/stock-prices?stock=GOOG&like=true

/api/stock-prices?stock=GOOG&stock=MSFT

/api/stock-prices?stock=GOOG&stock=MSFT&like=true

## Example return:

{"stockData":{"stock":"GOOG","price":"786.90","likes":1}}

{"stockData":[{"stock":"MSFT","price":"62.30","rel_likes":-1},{"stock":"GOOG",

"price":"786.90","rel_likes":1}]}
