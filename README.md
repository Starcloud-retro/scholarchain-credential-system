# 📚 ScholarChain

## Decentralized Achievement Credential System

ScholarChain is a blockchain-powered credential platform that converts academic, internship, workshop, research, and achievement records into secure digital credentials.

Traditional certificates can be lost, forged, or difficult to verify. ScholarChain solves this by issuing credentials as blockchain-backed Soulbound Tokens (SBTs), allowing anyone to instantly verify authenticity while ensuring ownership remains permanently tied to the recipient.

---

# 🌐 Live Demo

### Application URL

https://scholarchain-credential-system.vercel.app/

### GitHub Repository

https://github.com/Starcloud-retro/scholarchain-credential-system

---

# 🚀 Features

### 🎖 Soulbound Achievement Tokens
Credentials are issued as non-transferable NFTs (Soulbound Tokens) that remain permanently linked to the recipient.

### 🔍 Credential Verification
Any person, organization, or recruiter can verify credentials directly through the blockchain.

### 🌐 Public Verification Portal
Verification does not require access to the issuer's database.

### 🔑 Wallet-Based Authentication
Uses MetaMask for decentralized authentication.

### 📦 Decentralized Storage
Credential metadata and certificate assets are stored on IPFS through Pinata.

### 🖥 Modern Dashboard
Responsive React-based interface for issuing and verifying credentials.

### 🏛 Multi-Issuer Ready
Supports organizations issuing credentials through authorized blockchain wallets.

---

# 🛠 Technology Stack

## Frontend

- React
- Vite
- Ethers.js
- Tailwind CSS

## Blockchain

- Solidity
- Ethereum Sepolia Testnet
- OpenZeppelin Contracts

## Storage

- IPFS
- Pinata

## Wallet Integration

- MetaMask

## Deployment

- Vercel

---

# 🏗 System Architecture

```text
Issuer Wallet
      ↓
Creates Credential
      ↓
Metadata Uploaded to IPFS
      ↓
CID Generated
      ↓
Soulbound Token Minted
      ↓
Stored on Ethereum Blockchain
      ↓
Visible on Dashboard
      ↓
Public Verification
```

---

# 🎯 Supported Credential Types

- 🎓 Academic Credentials
- 💼 Internship Credentials
- 🛠 Workshop Credentials
- 🏆 Competition Credentials
- 📖 Research Credentials
- 🤝 Volunteer Credentials

---

# 📋 Prerequisites

Before running this project, install:

## 1. Node.js

Download:

https://nodejs.org/

Verify installation:

```bash
node -v
npm -v
```

## 2. MetaMask

Install browser extension:

https://metamask.io/

Create a wallet and switch to:

```text
Ethereum Sepolia Test Network
```

## 3. Git

Download:

https://git-scm.com/

Verify installation:

```bash
git --version
```

---

# ⚙ Local Installation

Clone repository:

```bash
git clone https://github.com/Starcloud-retro/scholarchain-credential-system.git
```

Move into project:

```bash
cd scholarchain-credential-system
```

Move into frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start development server:

```bash
npm run dev
```

Application runs at:

```text
http://localhost:5173
```

---

# ⛓ Smart Contract Deployment

Open Remix IDE:

https://remix.ethereum.org/

### Steps

1. Compile Solidity contract
2. Connect MetaMask
3. Select **Injected Provider**
4. Choose **Sepolia Network**
5. Deploy Contract
6. Copy deployed contract address

Update:

```javascript
src/contracts/config.js
```

Example:

```javascript
export const CONTRACT_ADDRESS =
"YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

---

# 📦 IPFS Metadata Upload

Create credential metadata JSON:

```json
{
  "name": "Blockchain Internship",
  "description": "Successfully completed Blockchain Internship Program",
  "image": "ipfs://YOUR_IMAGE_CID"
}
```

Upload metadata to Pinata.

Copy generated CID.

Use CID during credential minting.

---

# 🖥 Frontend Deployment (Vercel)

Install Vercel CLI:

```bash
npm install -g vercel
```

Login:

```bash
vercel login
```

Build project:

```bash
npm run build
```

Deploy:

```bash
vercel --prod
```

For React Router support create:

```text
frontend/vercel.json
```

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

---

# 🔍 Verification Process

1. Open Verify Credential page
2. Enter Token ID
3. Click Verify
4. Credential data is fetched from blockchain
5. Metadata is loaded from IPFS
6. Verification result is displayed instantly

---

# 📸 Screenshots

## Home Page

_Add screenshot here_

## Credential Verification

_Add screenshot here_

## My Credentials

_Add screenshot here_

## Issue Credential

_Add screenshot here_

---

# 👥 Team — Nexus Credential Systems

### Members

- Jalaneela Sai Sandeep (24R11A6622)
- Jamulapuram Dhanush Narayana (24R11A6623)
- Kampelli Suhan Ramesh (24R11A6628)
- Adusumilli Rohit Kumar (24R11A6652)
- Banoth Ganesh (24R11A6657)
- Shaik Zaheer Abbas (24R11A6690)

---

# 🌟 Future Enhancements

- QR Code Verification
- Multi-Organization Issuer Portal
- Credential Revocation Dashboard
- PDF Certificate Downloads
- Advanced Search Filters
- Employer Verification Portal
- Analytics Dashboard

---

# 📜 License

MIT License

---

## ❤️ Built With

- Solidity
- Ethereum Sepolia
- React
- Vite
- Ethers.js
- IPFS
- Pinata
- MetaMask
- Vercel

Built with ❤️ by **Nexus Credential Systems**
