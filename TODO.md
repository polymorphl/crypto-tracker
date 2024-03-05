# TODO

- Implement pagination in UI (with count + fetch())
- https://www.youtube.com/watch?v=VQFjyEa8vGE
- i18N ?
- Implement Redis ? (Local || Upstash service -- free tier)
- [SCRIPT folder ?] Migrate Notion CSV into a seed file
- [SCRIPT folder ?] Download all Crypto icons
- [SCRIPT folder ?] Find all icons for Providers (Coinbase, Binance, Crypto.com, etc...)
- Implement BlockchainAddress entity (to track activites on blockchain)
- Dig => hosting local img (CDN?)

# DOING

- Try to link Account on SignUp
- Re-do Auth with postgre (WIP)

---

- New indicators:
  - Provider page: First / Last transaction date
  - Provider page: Total invested in $USD
  - Asset page: Total invested in $USD

---

- Implement FileUpload for:

  - crypto.com
  - coinbase.com
  - Ledger

- (Test)work on `src/app/api/upload/routes.ts` with OpenAI
- Implement https://api.coincap.io/v2/assets for realtime data
- Dig https://towardsdatascience.com/obtain-unlimited-historical-crypto-data-through-simple-api-calls-without-keys-8a6f5ed55b43

# DONE

- Handle Session via Next-auth (TODO #1)
  - Credential provider
- Finish Login form
- Finish Signup form
- Remove Kinde
- Create `Link` entity (Asset + Provider + User Id)
- implement data-table filters (Asset & Provider)
- implement query `getTransactionsAmountForAssetId`
- implement `<AssetCard />`
- Implement some simple price (Coin Gecko endpoint)
- Create a coin-gecko account
- Create the `scripts` folder
- New query: Get Transactions by Provider
- Implement pagination with count (for Txns)
- Prettify UI
- New query: Get Transactions by Ticker (Asset)
- Implement `slug` on Provider
- Export Notion Database (CSV)
- Implement Read in UI
- Continue DB Schema
- Base Schema + db:seed system (https://dev.to/anasrin/seeding-database-with-drizzle-orm-fga)
- Create a Github repository
- Migrate the project to pnpm
- Setup Drizzle ORM
- Setup a PostgreSQL Database
- Setup shacdn UI library
- Setup a NextJS project
