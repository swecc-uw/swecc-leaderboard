# SWECC Leaderboard

| Command | Description |
| --- | --- |
| `npm install` | Install dependencies |
| `npm run dev` | Start the development server |
| `npm run build` | Compile the project |
| `npm run lint` | Lint the project |
| `npm run spellcheck` | Spellcheck the project |

## Deploying

There are existing GitHub actions to deploy on push to the main branch. Just configure actions in the repo settings and it should start to work.

If you need a .env.local file, create one as an actions secret in GitHub with the name `ENV_FILE`. This will then be created as a .env.local file in the root of the project when deploying.

Make sure to set up a subdomain of swecc.org for your project. Before doing so however, the github.io domain should be fine to use, but you'll need to update the `homepage` field in the `package.json` file to reflect it. It is preferred to use the swecc.org domain in the first place however.

To use the API in production, you'll need to allowlist the domain in `server/settings.py`.