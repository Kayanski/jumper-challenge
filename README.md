# Token Explorer Application

## Getting start

There's 2 directories into this repository with a README.md for each of those to have more informations about their respective setup.

### Frontend

The Frontend is a Next.js website. It allows users to login, verify their account ownership and query ERC-20 balances across multiple EVM chains.

### Backend

The Backend handles all the query work. It's here to save which user has connected to the frontend and all the query results. It serves as the app data layer, because we can't query everything from chain everytime.
