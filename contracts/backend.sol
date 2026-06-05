// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScholarChainSBT is ERC721URIStorage, Ownable {

    uint256 private _currentTokenId;

    // ───────────────── CREDENTIAL CATEGORIES ─────────────────
    enum CredentialType {
        Academic,    // 0
        Internship,  // 1
        Workshop,    // 2
        Competition, // 3
        Volunteer,   // 4
        Research     // 5
    }

    // ───────────────── ERRORS ─────────────────
    error TransferNotAllowed();
    error InvalidStudentAddress();
    error EmptyTokenURI();
    error EmptyCredentialId();
    error CredentialAlreadyExists();
    error CredentialAlreadyRevoked();
    error CredentialDoesNotExist();
    error InvalidCredentialType();

    // ───────────────── CREDENTIAL STRUCTURE ─────────────────
    struct Credential {
        string credentialId;
        uint256 issuedAt;
        CredentialType credentialType;
        bool revoked;
    }

    // tokenId => credential details
    mapping(uint256 => Credential) public credentials;

    // Prevent duplicate credential IDs
    mapping(string => bool) private credentialExists;

    // ───────────────── EVENTS ─────────────────
    event CredentialMinted(
        address indexed student,
        uint256 indexed tokenId,
        string credentialId,
        CredentialType indexed credentialType,
        string tokenURI
    );

    event CredentialRevoked(
        uint256 indexed tokenId,
        string credentialId
    );

    // ───────────────── CONSTRUCTOR ─────────────────
    constructor()
        ERC721("ScholarChain Credential", "SBT")
        Ownable(msg.sender)
    {}

    // ───────────────── MINT CREDENTIAL ─────────────────
    function mintCredential(
        address student,
        string memory credentialId,
        uint8 credentialType,
        string memory metadataURI
    )
        external
        onlyOwner
        returns (uint256)
    {
        if (student == address(0)) revert InvalidStudentAddress();
        if (bytes(credentialId).length == 0) revert EmptyCredentialId();
        if (bytes(metadataURI).length == 0) revert EmptyTokenURI();
        if (credentialType > 5) revert InvalidCredentialType();

        if (credentialExists[credentialId]) {
            revert CredentialAlreadyExists();
        }

        _currentTokenId++;
        uint256 tokenId = _currentTokenId;

        // Soulbound credential issuance
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, metadataURI);

        credentials[tokenId] = Credential({
            credentialId: credentialId,
            issuedAt: block.timestamp,
            credentialType: CredentialType(credentialType),
            revoked: false
        });

        credentialExists[credentialId] = true;

        emit CredentialMinted(
            student,
            tokenId,
            credentialId,
            CredentialType(credentialType),
            metadataURI
        );

        return tokenId;
    }

    // ───────────────── VERIFY CREDENTIAL ─────────────────
    function verifyCredential(
        uint256 tokenId
    )
        external
        view
        returns (
            bool exists,
            bool valid,
            string memory credentialId,
            uint256 issuedAt,
            CredentialType credentialType,
            address holder,
            string memory metadataURI
        )
    {
        holder = _ownerOf(tokenId);

        if (holder == address(0)) {
            return (
                false,
                false,
                "",
                0,
                CredentialType.Academic,
                address(0),
                ""
            );
        }

        Credential memory cred = credentials[tokenId];

        return (
            true,
            !cred.revoked,
            cred.credentialId,
            cred.issuedAt,
            cred.credentialType,
            holder,
            tokenURI(tokenId)
        );
    }

    // ───────────────── REVOKE CREDENTIAL ─────────────────
    function revokeCredential(uint256 tokenId) external onlyOwner {
        if (_ownerOf(tokenId) == address(0)) {
            revert CredentialDoesNotExist();
        }

        if (credentials[tokenId].revoked) {
            revert CredentialAlreadyRevoked();
        }

        credentials[tokenId].revoked = true;

        emit CredentialRevoked(
            tokenId,
            credentials[tokenId].credentialId
        );
    }

    // ───────────────── SOULBOUND ENFORCEMENT ─────────────────
    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override
        returns (address)
    {
        address previousOwner = super._update(to, tokenId, auth);

        // Allow minting (from zero address)
        // Allow burning (to zero address)
        // Block transfers between users
        if (previousOwner != address(0) && to != address(0)) {
            revert TransferNotAllowed();
        }

        return previousOwner;
    }

    // ───────────────── STATS ─────────────────
    function totalCredentialsIssued() external view returns (uint256) {
        return _currentTokenId;
    }
}