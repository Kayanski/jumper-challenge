# 🚀 Token Explorer Backend

## 🛠️ Getting Started

### Step 1: 🚀 Initial Setup

- Install dependencies: `npm install`

### Step 2: ⚙️ Environment Configuration

- Create `.env`: Copy `.env.template` to `.env`
- Update `.env`: Fill in necessary environment variables

      **_NOTE:_** This project uses the Alchemy endpoints to fetch token balances and metadata.

  Please create an account on Alchemy and set the `ALCHEMY_API_KEY` variable to get started.
  You shouldn't need to modify the env alchemy endpoint URLs.

### Step 3: 🏃‍♂️ Running the Project

- Development Mode: `npm run dev`
- Building: `npm run build`
- Production Mode: Set `.env` to `NODE_ENV="production"` then `npm run build && npm run start`

### Running tests

In order for the tests to run, you should respect the following:

- The alchemy endpoints for the chain that you query should be specified in env variables.
- The Alchemy Token should be defined in the env variables
