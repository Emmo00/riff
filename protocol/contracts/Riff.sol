// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import {Counter} from "./lib/Counter.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract Riff is Ownable, ReentrancyGuard {
    // Counters
    Counter private _trackIdCounter;
    Counter private _profileIdCounter;

    // Platform fee (10% = 1000 basis points)
    uint256 public constant PLATFORM_FEE_BPS = 1000;
    uint256 public constant MAX_BPS = 10000;

    uint256 public platformFeesAccumulated; // Track platform fees separately

    // Action Identifiers
    bytes32 constant ACTION_PLAY = keccak256("play");
    bytes32 constant ACTION_LIKE = keccak256("like");
    bytes32 constant ACTION_COMMENT = keccak256("comment");
    bytes32 constant ACTION_BANGER = keccak256("banger");

    // Default/Base Action Fees
    struct DefaultFees {
        uint256 feePerPlay;
        uint256 feePerLike;
        uint256 feePerComment;
        uint256 feeForBanger;
    }

    DefaultFees public defaultFees;

    // Structs
    struct Profile {
        uint256 profileId;
        address owner;
        string name;
        string bio;
        bool exists;
        uint256 totalEarnings;
    }

    struct MusicTrack {
        uint256 trackId;
        address artist;
        string cid;
        string title;
        string description;
        uint256 uploadTime;
        bool exists;
        bool deleted;
        uint256 totalEarnings;
        uint256 playCount;
        uint256 likeCount;
        uint256 commentCount;
        uint256 bangerCount;
    }

    struct Contributor {
        address contributor;
        uint256 percentage;
    }

    struct UserActionFees {
        uint256 feePerPlay;
        uint256 feePerLike;
        uint256 feePerComment;
        uint256 feeForBanger;
        bool isSet; // Track if user has custom fees
    }

    struct Comment {
        address commenter;
        string message;
        uint256 timestamp;
    }

    // Mappings
    mapping(address => Profile) public profiles;
    mapping(uint256 => MusicTrack) public tracks;
    mapping(address => UserActionFees) public userActionFees; // Per-user fees
    mapping(uint256 => Contributor[]) public trackContributors;
    mapping(uint256 => mapping(address => uint256)) public trackEarnings;
    mapping(address => uint256[]) public artistTracks;
    mapping(uint256 => Comment[]) public trackComments;

    // Events
    event ProfileRegistered(
        address indexed user,
        uint256 profileId,
        string name
    );
    event ProfileUpdated(address indexed user, string name, string bio);
    event TrackUploaded(
        uint256 indexed trackId,
        address indexed artist,
        string cid,
        string title
    );
    event TrackDeleted(uint256 indexed trackId, address indexed artist);
    event ActionRecorded(
        uint256 indexed trackId,
        address indexed user,
        string actionType
    );
    event CommentAdded(
        uint256 indexed trackId,
        address indexed commenter,
        string message
    );
    event PaymentProcessed(
        uint256 indexed trackId,
        address indexed user,
        uint256 amount,
        string actionType
    );
    event ContributorAdded(
        uint256 indexed trackId,
        address indexed contributor,
        uint256 percentage
    );
    event ContributorConfigured(
        uint256 indexed trackId,
        address indexed contributor,
        uint256 newPercentage
    );
    event EarningsWithdrawn(
        uint256 indexed trackId,
        address indexed recipient,
        uint256 amount
    );
    event ArtistTipped(
        address indexed artist,
        address indexed tipper,
        uint256 amount
    );
    event DefaultFeesUpdated(
        uint256 play,
        uint256 like,
        uint256 comment,
        uint256 banger
    );
    event UserFeesUpdated(
        address indexed user,
        uint256 play,
        uint256 like,
        uint256 comment,
        uint256 banger
    );

    IERC20 public paymentToken;

    constructor(
        address _paymentToken,
        uint256 _defaultPlay,
        uint256 _defaultLike,
        uint256 _defaultComment,
        uint256 _defaultBanger
    ) Ownable(msg.sender) {
        paymentToken = IERC20(_paymentToken);
        defaultFees = DefaultFees(
            _defaultPlay,
            _defaultLike,
            _defaultComment,
            _defaultBanger
        );
    }

    // Profile Management
    function registerProfile(
        string calldata name,
        string calldata bio
    ) external {
        require(!profiles[msg.sender].exists, "Profile already exists");
        require(bytes(name).length > 0, "Name cannot be empty");

        _profileIdCounter.increment();
        uint256 newProfileId = _profileIdCounter.current();

        profiles[msg.sender] = Profile({
            profileId: newProfileId,
            owner: msg.sender,
            name: name,
            bio: bio,
            exists: true,
            totalEarnings: 0
        });

        emit ProfileRegistered(msg.sender, newProfileId, name);
    }

    function updateProfile(string calldata name, string calldata bio) external {
        require(profiles[msg.sender].exists, "Profile does not exist");
        require(bytes(name).length > 0, "Name cannot be empty");

        profiles[msg.sender].name = name;
        profiles[msg.sender].bio = bio;

        emit ProfileUpdated(msg.sender, name, bio);
    }

    // Track Management
    function uploadTrack(
        string calldata cid,
        string calldata title,
        string calldata description
    ) external returns (uint256) {
        require(profiles[msg.sender].exists, "Must register profile first");
        require(bytes(cid).length > 0, "CID cannot be empty");
        require(bytes(title).length > 0, "Title cannot be empty");

        _trackIdCounter.increment();
        uint256 newTrackId = _trackIdCounter.current();

        tracks[newTrackId] = MusicTrack({
            trackId: newTrackId,
            artist: msg.sender,
            cid: cid,
            title: title,
            description: description,
            uploadTime: block.timestamp,
            exists: true,
            deleted: false,
            totalEarnings: 0,
            playCount: 0,
            likeCount: 0,
            commentCount: 0,
            bangerCount: 0
        });

        artistTracks[msg.sender].push(newTrackId);

        emit TrackUploaded(newTrackId, msg.sender, cid, title);
        return newTrackId;
    }

    function deleteTrack(uint256 trackId) external {
        require(tracks[trackId].exists, "Track does not exist");
        require(
            tracks[trackId].artist == msg.sender,
            "Only track owner can delete"
        );
        require(!tracks[trackId].deleted, "Track already deleted");

        tracks[trackId].deleted = true;
        emit TrackDeleted(trackId, msg.sender);
    }

    function deleteComment(uint256 trackId, uint256 commentIndex) external {
        require(tracks[trackId].exists, "Track does not exist");
        require(
            commentIndex < trackComments[trackId].length,
            "Invalid comment index"
        );

        Comment storage comment = trackComments[trackId][commentIndex];
        require(comment.commenter == msg.sender, "Only commenter can delete");

        // Remove the comment by replacing it with the last one and popping
        if (commentIndex < trackComments[trackId].length - 1) {
            trackComments[trackId][commentIndex] = trackComments[trackId][
                trackComments[trackId].length - 1
            ];
        }
        trackComments[trackId].pop();

        emit CommentAdded(trackId, msg.sender, "Comment deleted");
    }

    // User Fee Configuration
    function setFeePerPlay(uint256 fee) external {
        require(profiles[msg.sender].exists, "Profile does not exist");
        userActionFees[msg.sender].feePerPlay = fee;
        userActionFees[msg.sender].isSet = true;
    }

    function setFeePerLike(uint256 fee) external {
        require(profiles[msg.sender].exists, "Profile does not exist");
        userActionFees[msg.sender].feePerLike = fee;
        userActionFees[msg.sender].isSet = true;
    }

    function setFeePerComment(uint256 fee) external {
        require(profiles[msg.sender].exists, "Profile does not exist");
        userActionFees[msg.sender].feePerComment = fee;
        userActionFees[msg.sender].isSet = true;
    }

    function setFeeForBanger(uint256 fee) external {
        require(profiles[msg.sender].exists, "Profile does not exist");
        userActionFees[msg.sender].feeForBanger = fee;
        userActionFees[msg.sender].isSet = true;
    }

    function setAllUserFees(
        uint256 play,
        uint256 like,
        uint256 comment,
        uint256 banger
    ) external {
        require(profiles[msg.sender].exists, "Profile does not exist");

        userActionFees[msg.sender] = UserActionFees({
            feePerPlay: play,
            feePerLike: like,
            feePerComment: comment,
            feeForBanger: banger,
            isSet: true
        });

        emit UserFeesUpdated(msg.sender, play, like, comment, banger);
    }

    // Action Recording & Payment Processing
    function recordAction(uint256 trackId, bytes calldata actionData) external {
        require(tracks[trackId].exists, "Track does not exist");
        require(!tracks[trackId].deleted, "Track is deleted");

        (string memory actionType, bytes memory payload) = _decodeActionData(
            actionData
        );

        uint256 fee = _getActionFee(msg.sender, actionType);

        if (fee > 0) {
            require(
                paymentToken.transferFrom(msg.sender, address(this), fee),
                "Payment failed"
            );
            _processPayment(trackId, fee);
            emit PaymentProcessed(trackId, msg.sender, fee, actionType);
        }

        if (keccak256(bytes(actionType)) == keccak256("comment")) {
            _storeComment(trackId, msg.sender, abi.decode(payload, (string)));
        }

        _updateTrackStats(trackId, actionType);
        emit ActionRecorded(trackId, msg.sender, actionType);
    }

    function _decodeActionData(
        bytes calldata actionData
    ) internal pure returns (string memory actionType, bytes memory payload) {
        (actionType, payload) = abi.decode(actionData, (string, bytes));
    }

    function _getActionFee(
        address user,
        string memory actionType
    ) internal view returns (uint256) {
        bytes32 actionHash = keccak256(bytes(actionType));

        if (userActionFees[user].isSet) {
            UserActionFees memory fees = userActionFees[user];

            if (actionHash == ACTION_PLAY) return fees.feePerPlay;
            if (actionHash == ACTION_LIKE) return fees.feePerLike;
            if (actionHash == ACTION_COMMENT) return fees.feePerComment;
            if (actionHash == ACTION_BANGER) return fees.feeForBanger;
        } else {
            // Use default fees if user-specific fees are not set
            DefaultFees memory fees = defaultFees;

            if (actionHash == ACTION_PLAY) return fees.feePerPlay;
            if (actionHash == ACTION_LIKE) return fees.feePerLike;
            if (actionHash == ACTION_COMMENT) return fees.feePerComment;
            if (actionHash == ACTION_BANGER) return fees.feeForBanger;
        }

        return 0; // Unknown action, no fee
    }

    function _storeComment(
        uint256 trackId,
        address commenter,
        string memory message
    ) internal {
        require(bytes(message).length > 0, "Comment cannot be empty");

        trackComments[trackId].push(
            Comment({
                commenter: commenter,
                message: message,
                timestamp: block.timestamp
            })
        );

        emit CommentAdded(trackId, commenter, message);
    }

    function _updateTrackStats(
        uint256 trackId,
        string memory actionType
    ) internal {
        bytes32 actionHash = keccak256(abi.encodePacked(actionType));

        if (actionHash == keccak256(abi.encodePacked("play"))) {
            tracks[trackId].playCount++;
        } else if (actionHash == keccak256(abi.encodePacked("like"))) {
            tracks[trackId].likeCount++;
        } else if (actionHash == keccak256(abi.encodePacked("comment"))) {
            tracks[trackId].commentCount++;
        } else if (actionHash == keccak256(abi.encodePacked("banger"))) {
            tracks[trackId].bangerCount++;
        }
    }

    function _processPayment(uint256 trackId, uint256 totalAmount) internal {
        uint256 platformFee = (totalAmount * PLATFORM_FEE_BPS) / MAX_BPS;
        uint256 artistAmount = totalAmount - platformFee;

        platformFeesAccumulated += platformFee; // Track platform fees separately
        tracks[trackId].totalEarnings += artistAmount;

        Contributor[] memory contributors = trackContributors[trackId];
        if (contributors.length > 0) {
            uint256 remainingAmount = artistAmount;

            for (uint256 i = 0; i < contributors.length; i++) {
                uint256 contributorAmount = (artistAmount *
                    contributors[i].percentage) / MAX_BPS;
                trackEarnings[trackId][
                    contributors[i].contributor
                ] += contributorAmount;
                remainingAmount -= contributorAmount;
            }

            trackEarnings[trackId][tracks[trackId].artist] += remainingAmount;
        } else {
            trackEarnings[trackId][tracks[trackId].artist] += artistAmount;
        }

        profiles[tracks[trackId].artist].totalEarnings += artistAmount;
    }

    // Contributor Management
    function addContributor(
        uint256 trackId,
        address contributor,
        uint256 percentage
    ) external {
        require(tracks[trackId].exists, "Track does not exist");
        require(
            tracks[trackId].artist == msg.sender,
            "Only artist can add contributors"
        );
        require(contributor != address(0), "Invalid contributor address");
        require(percentage > 0 && percentage <= MAX_BPS, "Invalid percentage");

        uint256 totalPercentage = percentage;
        for (uint256 i = 0; i < trackContributors[trackId].length; i++) {
            totalPercentage += trackContributors[trackId][i].percentage;
        }
        require(totalPercentage <= MAX_BPS, "Total percentage exceeds 100%");

        trackContributors[trackId].push(
            Contributor({contributor: contributor, percentage: percentage})
        );

        emit ContributorAdded(trackId, contributor, percentage);
    }

    function configureContributor(
        uint256 trackId,
        address contributor,
        uint256 newPercentage
    ) external {
        require(tracks[trackId].exists, "Track does not exist");
        require(
            tracks[trackId].artist == msg.sender,
            "Only artist can configure contributors"
        );
        require(
            newPercentage > 0 && newPercentage <= MAX_BPS,
            "Invalid percentage"
        );

        bool found = false;
        uint256 totalPercentage = 0;

        for (uint256 i = 0; i < trackContributors[trackId].length; i++) {
            if (trackContributors[trackId][i].contributor == contributor) {
                trackContributors[trackId][i].percentage = newPercentage;
                found = true;
            }
            totalPercentage += trackContributors[trackId][i].percentage;
        }

        require(found, "Contributor not found");
        require(totalPercentage <= MAX_BPS, "Total percentage exceeds 100%");

        emit ContributorConfigured(trackId, contributor, newPercentage);
    }

    // Earnings Management
    function viewTrackEarnings(
        uint256 trackId
    ) external view returns (uint256) {
        return trackEarnings[trackId][msg.sender];
    }

    function withdrawTrackEarnings(uint256 trackId) external nonReentrant {
        uint256 earnings = trackEarnings[trackId][msg.sender];
        require(earnings > 0, "No earnings to withdraw");

        trackEarnings[trackId][msg.sender] = 0;
        require(paymentToken.transfer(msg.sender, earnings), "Transfer failed");

        emit EarningsWithdrawn(trackId, msg.sender, earnings);
    }

    // Tipping
    function tipArtist(address artist, uint256 amount) external {
        require(profiles[artist].exists, "Artist profile does not exist");
        require(amount > 0, "Amount must be greater than 0");

        require(
            paymentToken.transferFrom(msg.sender, artist, amount),
            "Tip transfer failed"
        );
        profiles[artist].totalEarnings += amount;

        emit ArtistTipped(artist, msg.sender, amount);
    }

    // View Functions
    function getTrack(
        uint256 trackId
    ) external view returns (MusicTrack memory) {
        return tracks[trackId];
    }

    function getTrackComments(
        uint256 trackId
    ) external view returns (Comment[] memory) {
        return trackComments[trackId];
    }

    function getProfile(address user) external view returns (Profile memory) {
        return profiles[user];
    }

    function getUserFees(
        address user
    ) external view returns (UserActionFees memory) {
        return userActionFees[user];
    }

    function getDefaultFees() external view returns (DefaultFees memory) {
        return defaultFees;
    }

    function getTrackContributors(
        uint256 trackId
    ) external view returns (Contributor[] memory) {
        return trackContributors[trackId];
    }

    function getArtistTracks(
        address artist
    ) external view returns (uint256[] memory) {
        return artistTracks[artist];
    }

    // Admin Functions
    function setDefaultFees(
        uint256 play,
        uint256 like,
        uint256 comment,
        uint256 banger
    ) external onlyOwner {
        defaultFees = DefaultFees(play, like, comment, banger);
        emit DefaultFeesUpdated(play, like, comment, banger);
    }

    function withdrawPlatformFees() external onlyOwner nonReentrant {
        require(platformFeesAccumulated > 0, "No platform fees to withdraw");

        uint256 feesToWithdraw = platformFeesAccumulated;
        platformFeesAccumulated = 0;

        require(
            paymentToken.transfer(owner(), feesToWithdraw),
            "Transfer failed"
        );
    }

    function getPlatformFeesAccumulated() external view returns (uint256) {
        return platformFeesAccumulated;
    }

    function updatePaymentToken(address newToken) external onlyOwner {
        paymentToken = IERC20(newToken);
    }
}
