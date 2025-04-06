
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

/**
 * @title CrowdFundChain
 * @dev A decentralized crowdfunding platform where users can create and fund campaigns
 */
contract CrowdFundChain {
    // Campaign struct to store campaign details
    struct Campaign {
        address creator;
        string title;
        string description;
        uint256 fundingGoal;
        uint256 amountRaised;
        uint256 deadline;
        bool isClosed;
        mapping(address => uint256) contributions;
    }

    // State variables
    uint256 private campaignCount = 0;
    mapping(uint256 => Campaign) private campaigns;
    mapping(address => uint256[]) private userCampaigns;
    uint256[] private allCampaignIds;

    // Events
    event CampaignCreated(uint256 indexed campaignId, address indexed creator, string title, uint256 fundingGoal, uint256 deadline);
    event ContributionReceived(uint256 indexed campaignId, address indexed contributor, uint256 amount);
    event FundsWithdrawn(uint256 indexed campaignId, address indexed creator, uint256 amount);
    event CampaignClosed(uint256 indexed campaignId);

    // Modifiers
    modifier campaignExists(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Campaign does not exist");
        _;
    }

    modifier onlyCreator(uint256 _campaignId) {
        require(campaigns[_campaignId].creator == msg.sender, "Only the creator can perform this action");
        _;
    }

    modifier campaignActive(uint256 _campaignId) {
        require(!campaigns[_campaignId].isClosed, "Campaign is closed");
        require(block.timestamp < campaigns[_campaignId].deadline, "Campaign deadline has passed");
        _;
    }

    modifier campaignEnded(uint256 _campaignId) {
        require(block.timestamp >= campaigns[_campaignId].deadline || campaigns[_campaignId].isClosed, "Campaign has not ended yet");
        _;
    }

    /**
     * @dev Creates a new campaign
     * @param _title Title of the campaign
     * @param _description Description of the campaign
     * @param _fundingGoal Funding goal in wei
     * @param _deadline Unix timestamp for the deadline
     * @return campaignId ID of the new campaign
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _fundingGoal,
        uint256 _deadline
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(_fundingGoal > 0, "Funding goal must be greater than 0");
        require(_deadline > block.timestamp, "Deadline must be in the future");

        campaignCount++;
        Campaign storage newCampaign = campaigns[campaignCount];
        newCampaign.creator = msg.sender;
        newCampaign.title = _title;
        newCampaign.description = _description;
        newCampaign.fundingGoal = _fundingGoal;
        newCampaign.amountRaised = 0;
        newCampaign.deadline = _deadline;
        newCampaign.isClosed = false;

        userCampaigns[msg.sender].push(campaignCount);
        allCampaignIds.push(campaignCount);

        emit CampaignCreated(campaignCount, msg.sender, _title, _fundingGoal, _deadline);
        return campaignCount;
    }

    /**
     * @dev Allows a user to contribute to a campaign
     * @param _campaignId ID of the campaign
     */
    function contribute(uint256 _campaignId) external payable campaignExists(_campaignId) campaignActive(_campaignId) {
        require(msg.value > 0, "Contribution amount must be greater than 0");

        Campaign storage campaign = campaigns[_campaignId];
        campaign.contributions[msg.sender] += msg.value;
        campaign.amountRaised += msg.value;

        emit ContributionReceived(_campaignId, msg.sender, msg.value);

        // Auto-close if funding goal is reached
        if (campaign.amountRaised >= campaign.fundingGoal) {
            campaign.isClosed = true;
            emit CampaignClosed(_campaignId);
        }
    }

    /**
     * @dev Allows the campaign creator to withdraw funds after the deadline
     * @param _campaignId ID of the campaign
     */
    function withdrawFunds(uint256 _campaignId) external campaignExists(_campaignId) onlyCreator(_campaignId) campaignEnded(_campaignId) {
        Campaign storage campaign = campaigns[_campaignId];
        uint256 amount = campaign.amountRaised;
        
        require(amount > 0, "No funds to withdraw");
        
        campaign.amountRaised = 0;
        campaign.isClosed = true;

        (bool success, ) = payable(campaign.creator).call{value: amount}("");
        require(success, "Transfer failed");

        emit FundsWithdrawn(_campaignId, campaign.creator, amount);
        emit CampaignClosed(_campaignId);
    }

    /**
     * @dev Closes a campaign manually
     * @param _campaignId ID of the campaign
     */
    function closeCampaign(uint256 _campaignId) external campaignExists(_campaignId) onlyCreator(_campaignId) campaignActive(_campaignId) {
        campaigns[_campaignId].isClosed = true;
        emit CampaignClosed(_campaignId);
    }

    /**
     * @dev Returns campaign details
     * @param _campaignId ID of the campaign
     * @return creator Campaign creator address
     * @return title Campaign title
     * @return description Campaign description
     * @return fundingGoal Campaign funding goal
     * @return amountRaised Amount raised so far
     * @return deadline Campaign deadline timestamp
     * @return isClosed Whether the campaign is closed
     */
    function getCampaign(uint256 _campaignId) external view campaignExists(_campaignId) returns (
        address creator,
        string memory title,
        string memory description,
        uint256 fundingGoal,
        uint256 amountRaised,
        uint256 deadline,
        bool isClosed
    ) {
        Campaign storage campaign = campaigns[_campaignId];
        return (
            campaign.creator,
            campaign.title,
            campaign.description,
            campaign.fundingGoal,
            campaign.amountRaised,
            campaign.deadline,
            campaign.isClosed
        );
    }

    /**
     * @dev Returns the contribution amount for a specific user to a campaign
     * @param _campaignId ID of the campaign
     * @param _contributor Address of the contributor
     * @return Contribution amount
     */
    function getContribution(uint256 _campaignId, address _contributor) external view campaignExists(_campaignId) returns (uint256) {
        return campaigns[_campaignId].contributions[_contributor];
    }

    /**
     * @dev Returns all campaign IDs
     * @return Array of campaign IDs
     */
    function getAllCampaigns() external view returns (uint256[] memory) {
        return allCampaignIds;
    }

    /**
     * @dev Returns all campaign IDs created by a user
     * @param _user Address of the user
     * @return Array of campaign IDs
     */
    function getUserCampaigns(address _user) external view returns (uint256[] memory) {
        return userCampaigns[_user];
    }

    /**
     * @dev Returns the total number of campaigns
     * @return Campaign count
     */
    function getCampaignCount() external view returns (uint256) {
        return campaignCount;
    }
}
