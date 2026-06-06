// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract ScholarChainSBT is ERC721URIStorage, Ownable {

    uint256 private _currentTokenId;

    // =====================================================
    // CREDENTIAL TYPES
    // =====================================================

    enum CredentialType {
        Academic,
        Internship,
        Workshop,
        Competition,
        Volunteer,
        Research
    }

    // =====================================================
    // ERRORS
    // =====================================================

    error TransferNotAllowed();
    error InvalidStudentAddress();
    error EmptyTokenURI();
    error EmptyCredentialId();
    error EmptyAchievementTitle();
    error EmptyIssuerName();
    error CredentialAlreadyExists();
    error CredentialAlreadyRevoked();
    error CredentialDoesNotExist();
    error InvalidCredentialType();
    error UnauthorizedIssuer();
    error InvalidIssuerAddress();
    error AuthorizedIssuerAlreadyExists();
    error AuthorizedIssuerDoesNotExist();
    error CannotRemoveContractOwner();

    // =====================================================
    // STORAGE STRUCT
    // =====================================================

    struct Credential {
        string credentialId;
        string achievementTitle;
        string issuerName;
        uint256 issuedAt;
        CredentialType credentialType;
        bool revoked;
    }

    // =====================================================
    // FRONTEND STRUCT
    // =====================================================

    struct CredentialInfo {
        string credentialId;
        string achievementTitle;
        string issuerName;
        uint256 issuedAt;
        CredentialType credentialType;
        bool revoked;
        address holder;
        string metadataURI;
    }

    // =====================================================
    // STORAGE
    // =====================================================

    mapping(uint256 => Credential) private credentials;

    mapping(string => bool) private credentialExistsMap;

    mapping(address => bool) public authorizedIssuers;

    address[] private authorizedIssuerList;

    mapping(address => uint256) private authorizedIssuerIndex;

    // =====================================================
    // EVENTS
    // =====================================================

    event CredentialMinted(
        address indexed student,
        uint256 indexed tokenId,
        string credentialId,
        string achievementTitle,
        string issuerName,
        CredentialType credentialType,
        string metadataURI
    );

    event CredentialRevoked(
        uint256 indexed tokenId,
        string credentialId
    );

    event AuthorizedIssuerAdded(address indexed issuer);
    event AuthorizedIssuerRemoved(address indexed issuer);

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    constructor()
        ERC721("ScholarChain Credential", "SCRED")
        Ownable(msg.sender)
    {
        authorizedIssuers[msg.sender] = true;
        authorizedIssuerList.push(msg.sender);
        authorizedIssuerIndex[msg.sender] = 1;
    }

    modifier onlyAuthorizedIssuer() {
        if (!authorizedIssuers[msg.sender])
            revert UnauthorizedIssuer();

        _;
    }

    // =====================================================
    // MINT
    // =====================================================

    function mintCredential(
        address student,
        string memory credentialId,
        string memory achievementTitle,
        string memory issuerName,
        uint8 credentialType,
        string memory metadataURI
    )
        external
        onlyAuthorizedIssuer
        returns (uint256)
    {
        if (student == address(0))
            revert InvalidStudentAddress();

        if (bytes(credentialId).length == 0)
            revert EmptyCredentialId();

        if (bytes(achievementTitle).length == 0)
            revert EmptyAchievementTitle();

        if (bytes(issuerName).length == 0)
            revert EmptyIssuerName();

        if (bytes(metadataURI).length == 0)
            revert EmptyTokenURI();

        if (credentialType > 5)
            revert InvalidCredentialType();

        if (credentialExistsMap[credentialId])
            revert CredentialAlreadyExists();

        _currentTokenId++;

        uint256 tokenId = _currentTokenId;

        _safeMint(student, tokenId);

        _setTokenURI(tokenId, metadataURI);

        credentials[tokenId] = Credential({
            credentialId: credentialId,
            achievementTitle: achievementTitle,
            issuerName: issuerName,
            issuedAt: block.timestamp,
            credentialType: CredentialType(credentialType),
            revoked: false
        });

        credentialExistsMap[credentialId] = true;

        emit CredentialMinted(
            student,
            tokenId,
            credentialId,
            achievementTitle,
            issuerName,
            CredentialType(credentialType),
            metadataURI
        );

        return tokenId;
    }

    // =====================================================
    // AUTHORIZED ISSUERS
    // =====================================================

    function addAuthorizedIssuer(address issuer)
        external
        onlyOwner
    {
        if (issuer == address(0))
            revert InvalidIssuerAddress();

        if (authorizedIssuers[issuer])
            revert AuthorizedIssuerAlreadyExists();

        authorizedIssuers[issuer] = true;
        authorizedIssuerList.push(issuer);
        authorizedIssuerIndex[issuer] = authorizedIssuerList.length;

        emit AuthorizedIssuerAdded(issuer);
    }

    function removeAuthorizedIssuer(address issuer)
        external
        onlyOwner
    {
        if (issuer == owner())
            revert CannotRemoveContractOwner();

        if (!authorizedIssuers[issuer])
            revert AuthorizedIssuerDoesNotExist();

        authorizedIssuers[issuer] = false;

        uint256 index = authorizedIssuerIndex[issuer];
        uint256 lastIndex = authorizedIssuerList.length;

        if (index != 0 && index <= lastIndex) {
            uint256 arrayIndex = index - 1;
            uint256 lastArrayIndex = lastIndex - 1;
            address lastIssuer = authorizedIssuerList[lastArrayIndex];

            authorizedIssuerList[arrayIndex] = lastIssuer;
            authorizedIssuerIndex[lastIssuer] = index;

            authorizedIssuerList.pop();
            delete authorizedIssuerIndex[issuer];
        }

        emit AuthorizedIssuerRemoved(issuer);
    }

    function isAuthorizedIssuer(address issuer)
        external
        view
        returns (bool)
    {
        return authorizedIssuers[issuer];
    }

    function getAuthorizedIssuerCount()
        external
        view
        returns (uint256)
    {
        return authorizedIssuerList.length;
    }

    function getAuthorizedIssuerAt(uint256 index)
        external
        view
        returns (address)
    {
        return authorizedIssuerList[index];
    }

    // =====================================================
    // GET CREDENTIAL
    // =====================================================

    function getCredential(
        uint256 tokenId
    )
        external
        view
        returns (CredentialInfo memory)
    {
        address holder = _ownerOf(tokenId);

        if (holder == address(0))
            revert CredentialDoesNotExist();

        Credential memory cred = credentials[tokenId];

        return CredentialInfo({
            credentialId: cred.credentialId,
            achievementTitle: cred.achievementTitle,
            issuerName: cred.issuerName,
            issuedAt: cred.issuedAt,
            credentialType: cred.credentialType,
            revoked: cred.revoked,
            holder: holder,
            metadataURI: tokenURI(tokenId)
        });
    }

    // =====================================================
    // VALIDITY CHECK
    // =====================================================

    function isCredentialValid(
        uint256 tokenId
    )
        external
        view
        returns (bool)
    {
        address holder = _ownerOf(tokenId);

        if (holder == address(0))
            return false;

        return !credentials[tokenId].revoked;
    }

    // =====================================================
    // EXISTS CHECK
    // =====================================================

    function credentialExists(
        uint256 tokenId
    )
        external
        view
        returns (bool)
    {
        return _ownerOf(tokenId) != address(0);
    }

    // =====================================================
    // REVOKE
    // =====================================================

    function revokeCredential(
        uint256 tokenId
    )
        external
        onlyOwner
    {
        if (_ownerOf(tokenId) == address(0))
            revert CredentialDoesNotExist();

        if (credentials[tokenId].revoked)
            revert CredentialAlreadyRevoked();

        credentials[tokenId].revoked = true;

        emit CredentialRevoked(
            tokenId,
            credentials[tokenId].credentialId
        );
    }

    // =====================================================
    // TOTAL ISSUED
    // =====================================================

    function totalCredentialsIssued()
        external
        view
        returns (uint256)
    {
        return _currentTokenId;
    }

    // =====================================================
    // SOULBOUND ENFORCEMENT
    // =====================================================

    function _update(
        address to,
        uint256 tokenId,
        address auth
    )
        internal
        override
        returns (address)
    {
        address previousOwner =
            super._update(to, tokenId, auth);

        // Minting allowed
        // Burning allowed
        // User-to-user transfers blocked

        if (
            previousOwner != address(0) &&
            to != address(0)
        ) {
            revert TransferNotAllowed();
        }

        return previousOwner;
    }
}