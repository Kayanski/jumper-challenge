# Token Explorer Application

## Getting started

There's 2 directories into this repository with a README.md for each of those to have more informations about their respective setup.

### Frontend

The Frontend is a Next.js website. It allows users to login, verify their account ownership and query ERC-20 balances across multiple EVM chains.

### Backend

The Backend handles all the query work. It's here to save which user has connected to the frontend and all the query results. It serves as the app data layer, because we can't query everything from chain everytime.

## Development assumptions

Here are some assumptions that were made during development:

- Spam tokens : They are useless but crash the UI because they don't respect the usual rules. I decided to hide them and allow users to show them if necessary (it's a UX and safety decision)
- I updated Express to 5 to get better error handling. Every error is caught, the server almost never crashes because of user interactions.
- I updated MUI  to 7 to get better support in general (and matching the jumper.exchange UI)
- The Fetch all endpoint is not paginated (for tokens and for balances). It should have pagination when going for a production app.
- Every time the users asks for their balances, the system queries from the alchemy API. This is not optimized. We should use caching (for instance not query more than every 10 seconds), to avoid this kind of issues (especially for queries coming from the frontend)
