import { http, HttpResponse } from 'msw'

export const handlers = [
    http.get('/api/topic-graph', () => {
      return HttpResponse.json({
        nodes: [
          {
            id: 'sui',
            label: 'Sui',
            title: 'Sui',
            shortDesc: 'Next-gen Layer 1 for instant settlement and low fees.',
            longDesc: 'Sui is a high-throughput, low-latency blockchain designed for decentralized applications and asset ownership.',
            difficulty: 4,
            toc: [
              { name: 'Sui Overview', link: 'https://docs.sui.io/learn/' },
              { name: 'Sui Move Basics', link: 'https://docs.sui.io/learn/move/' },
            ],
            logoUrl: '/assets/sui.png',
          },
          {
            id: 'move',
            label: 'Move',
            title: 'Move',
            shortDesc: 'Sui’s smart contract language for secure assets.',
            longDesc: 'Move is a Rust-based language focused on safety and flexibility. Essential for on-chain logic.',
            difficulty: 7,
            toc: [
              { name: 'Move Language Intro', link: 'https://docs.sui.io/learn/move/' },
            ],
            logoUrl: '/assets/move.png',
          },
          {
            id: 'consensus',
            label: 'Consensus',
            title: 'Consensus',
            shortDesc: 'Narwhal & Bullshark power Sui’s fast finality.',
            longDesc: 'Sui consensus separates data availability from ordering. Learn how Narwhal and Bullshark work together.',
            difficulty: 8,
            toc: [
              { name: 'Narwhal-Bullshark', link: 'https://docs.sui.io/learn/consensus/' },
            ],
            logoUrl: '/assets/consensus.png',
          },
          {
            id: 'object',
            label: 'Object-centric',
            title: 'Object',
            shortDesc: 'Every asset is an object: Sui’s unique model.',
            longDesc: 'Sui objects represent owned assets, allowing direct, efficient transfers and composability.',
            difficulty: 5,
            toc: [
              { name: 'Objects in Sui', link: 'https://docs.sui.io/learn/object-centric/' },
            ],
            logoUrl: '/assets/object.png',
          },
          {
            id: 'validator',
            label: 'Validator',
            title: 'Validator',
            shortDesc: 'Validators secure and operate the Sui network.',
            longDesc: 'Validators run the Sui consensus and process transactions, earning rewards for their work.',
            difficulty: 5,
            toc: [
              { name: 'Run a Validator', link: 'https://docs.sui.io/operate/validator/' },
            ],
            logoUrl: '/assets/validator.png',
          },
          {
            id: 'epoch',
            label: 'Epochs',
            title: 'Epochs',
            shortDesc: 'Epochs govern validator rotation and rewards.',
            longDesc: 'Sui epochs manage validator sets, staking rewards, and protocol upgrades, ensuring network health.',
            difficulty: 6,
            toc: [
              { name: 'Epoch Transitions', link: 'https://docs.sui.io/learn/epochs/' },
            ],
            logoUrl: '/assets/epoch.png',
          },
          {
            id: 'gas',
            label: 'Gas',
            title: 'Gas',
            shortDesc: 'Gas fees pay for computation and storage on Sui.',
            longDesc: 'Learn how gas pricing, storage, and refund mechanics work on Sui’s scalable architecture.',
            difficulty: 3,
            toc: [
              { name: 'Gas Mechanics', link: 'https://docs.sui.io/learn/gas/' },
            ],
            logoUrl: 'https://img.bgstatic.com/multiLang/web/ddaa6a136cd4d6034381e46686092c10.png',
          },
          {
            id: 'zklogin',
            label: 'zkLogin',
            title: 'zkLogin',
            shortDesc: 'Web2 login for Web3 dApps—powered by ZK.',
            longDesc: 'zkLogin lets users sign in with Google/Apple/etc, using zero-knowledge proofs for non-custodial access.',
            difficulty: 8,
            toc: [
              { name: 'zkLogin Intro', link: 'https://docs.sui.io/learn/zklogin/' },
            ],
            logoUrl: 'https://cdn.prod.website-files.com/6425f546844727ce5fb9e5ab/658341f3c62404465a1d3f4f_26_zklogin.webp',
          },
          {
            id: 'devnet',
            label: 'Devnet',
            title: 'Devnet',
            shortDesc: 'Public testnet for Sui developers.',
            longDesc: 'Devnet allows developers to deploy, test, and experiment before going live on Mainnet.',
            difficulty: 2,
            toc: [
              { name: 'Get Started on Devnet', link: 'https://docs.sui.io/testnet/devnet/' },
            ],
            logoUrl: 'https://blog.sui.io/content/images/2023/04/Sui-DevNet.png',
          },
          {
            id: 'mainnet',
            label: 'Mainnet',
            title: 'Mainnet',
            shortDesc: 'Sui’s production network—live and open.',
            longDesc: 'Mainnet is the live Sui blockchain, secured by validators, running real assets and apps.',
            difficulty: 4,
            toc: [
              { name: 'Mainnet Launch', link: 'https://docs.sui.io/mainnet/' },
            ],
            logoUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ54SXbS4CsglzCIdQ3xUACwuUlGtgldgqHmg&s',
          },
        ],
        links: [
          { source: 'sui', target: 'move' },
          { source: 'sui', target: 'consensus' },
          { source: 'sui', target: 'object' },
          { source: 'sui', target: 'validator' },
          { source: 'sui', target: 'gas' },
          { source: 'sui', target: 'zklogin' },
          { source: 'sui', target: 'devnet' },
          { source: 'sui', target: 'mainnet' },
          { source: 'move', target: 'object' },
          { source: 'consensus', target: 'validator' },
          { source: 'validator', target: 'epoch' },
          { source: 'epoch', target: 'mainnet' },
        ]
      })
    }),
  ]
  