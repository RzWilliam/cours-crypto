# Rendu Blockchain

- 📕 [Powerpoint](https://gamma.app/docs/Revolutionner-le-Jeu-avec-la-Blockchain-qec3n88h04h3cvb)
- 📄 [Document](https://docs.google.com/document/d/1LWF75Oji-39Aq9adMeGzO3k8uOt9-8Y5p_nBo0In1QE/edit?usp=sharing)
- 💻 [Maquette](https://www.figma.com/design/lCToiJMABMa6y05gKOEPfH/Cours-Crypto?node-id=0-1&t=13HZwBqOaX4bvE9Y-1)



## Requirements

Before you begin, you need to install the following tools:

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)

## Quickstart

1. Install dependencies if it was skipped in CLI:

```
yarn install
```

2. Run a local network in the first terminal:

```
yarn chain
```

3. On a second terminal, deploy the test contract:

```
yarn deploy
```

4. Run Socket server, on a third terminal:
```
cd packages
cd nextjs
node socket-server.mjs
```

5. On a fourth terminal, start your NextJS app:

```
yarn start
```
