# ScholarChain



## Decentralized Credential Verification Platform



ScholarChain is a blockchain-based credential management and verification platform that enables institutions to issue secure, tamper-proof digital credentials as Soulbound Tokens (SBTs). The platform provides a transparent and decentralized mechanism for issuing, storing, and verifying academic and professional achievements.



By leveraging Ethereum blockchain technology and decentralized storage, ScholarChain ensures credential authenticity, ownership integrity, and public verifiability without reliance on centralized databases.



---



## Live Deployment



**Application:**

https://scholarchain-credential-system.vercel.app/



**Repository:**

https://github.com/Starcloud-retro/scholarchain-credential-system



---



## Key Features



### Credential Issuance



* Blockchain-based credential creation

* Soulbound (non-transferable) token architecture

* Immutable academic and professional records

* Metadata storage through IPFS



### Credential Verification



* Public verification portal

* On-chain authenticity validation

* Instant ownership verification

* Transparent credential history



### Role-Based Access Control



* **Student** – View and verify issued credentials

* **Issuer** – Create and manage credentials

* **Administrator** – Approve issuers and govern the platform



### Decentralized Infrastructure



* Ethereum Sepolia integration

* IPFS-based metadata storage

* MetaMask wallet authentication

* Smart contract–driven trust model



---



## System Architecture



```text

Institution / Organization

            │

            ▼

     Issue Credential

            │

            ▼

      Metadata (IPFS)

            │

            ▼

     Soulbound Token

            │

            ▼

 Ethereum Smart Contract

            │

            ▼

 Credential Dashboard

            │

            ▼

 Public Verification

```



---



## Technology Stack



### Frontend



* React

* Vite

* React Router

* Ethers.js

* Tailwind CSS



### Blockchain



* Solidity

* Ethereum Sepolia Testnet



### Storage



* IPFS

* Pinata



### Authentication



* MetaMask



### Deployment



* GitHub

* Vercel



---



## Project Structure



```text

scholarchain/

│

├── contracts/          Smart contracts

├── docs/               Project documentation

├── json/               Credential metadata samples

├── frontend/           React application

│   ├── src/

│   ├── public/

│   ├── package.json

│   └── vite.config.js

│

└── README.md

```



---



## Workflow



```text

Issuer

   │

   ▼

Creates Credential

   │

   ▼

Uploads Metadata to IPFS

   │

   ▼

Smart Contract Mints SBT

   │

   ▼

Credential Assigned to Student

   │

   ▼

Public Verification Available

```



---



## Current Capabilities



* Wallet-based authentication

* Role-aware user interface

* Credential issuance and retrieval

* Credential verification portal

* IPFS metadata integration

* Administrator-controlled issuer approval workflow

* Soulbound credential architecture

* Ethereum Sepolia deployment



---



## Future Enhancements



* QR-code credential verification

* Multi-chain deployment support

* Institutional verification framework

* Employer verification portal

* DAO-based governance model

* Reputation-based issuer scoring

* Advanced analytics dashboard



---



## Team



### Nexus Credential Systems



* Jalaneela Sai Sandeep (24R11A6622)

* Jamulapuram Dhanush Narayana (24R11A6623)

* Kampelli Suhan Ramesh (24R11A6628)

* Adusumilli Rohit Kumar (24R11A6652)

* Banoth Ganesh (24R11A6657)

* Shaik Zaheer Abbas (24R11A6690)



---



## License



This project is licensed under the MIT License.
