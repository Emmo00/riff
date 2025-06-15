// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RiffToken is ERC20, ERC20Burnable, ERC20Permit, Ownable {
    uint8 private _decimals = 18;
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    
    // Vesting schedules
    struct VestingSchedule {
        uint256 totalAmount;
        uint256 releasedAmount;
        uint256 startTime;
        uint256 duration;
        bool revocable;
        bool revoked;
    }
    
    mapping(address => VestingSchedule) public vestingSchedules;
    
    // Events
    event VestingScheduleCreated(address indexed beneficiary, uint256 amount, uint256 duration);
    event VestingScheduleRevoked(address indexed beneficiary);
    event TokensReleased(address indexed beneficiary, uint256 amount);
    
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply,
        address initialOwner
    ) ERC20(name, symbol) ERC20Permit(name) Ownable(msg.sender) {
        require(initialSupply <= MAX_SUPPLY, "Initial supply exceeds max supply");
        _mint(initialOwner, initialSupply);
        _transferOwnership(initialOwner);
    }
    
    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }
    
    // Minting function (only owner)
    function mint(address to, uint256 amount) external onlyOwner {
        require(totalSupply() + amount <= MAX_SUPPLY, "Exceeds max supply");
        _mint(to, amount);
    }
    
    // Batch transfer for airdrops
    function batchTransfer(address[] calldata recipients, uint256[] calldata amounts) external {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            transfer(recipients[i], amounts[i]);
        }
    }
    
    // Vesting functionality
    function createVestingSchedule(
        address beneficiary,
        uint256 amount,
        uint256 duration,
        bool revocable
    ) external onlyOwner {
        require(beneficiary != address(0), "Invalid beneficiary");
        require(amount > 0, "Amount must be greater than 0");
        require(duration > 0, "Duration must be greater than 0");
        require(vestingSchedules[beneficiary].totalAmount == 0, "Vesting schedule already exists");
        
        vestingSchedules[beneficiary] = VestingSchedule({
            totalAmount: amount,
            releasedAmount: 0,
            startTime: block.timestamp,
            duration: duration,
            revocable: revocable,
            revoked: false
        });
        
        _transfer(msg.sender, address(this), amount);
        emit VestingScheduleCreated(beneficiary, amount, duration);
    }
    
    function releaseVestedTokens() external {
        VestingSchedule storage schedule = vestingSchedules[msg.sender];
        require(schedule.totalAmount > 0, "No vesting schedule found");
        require(!schedule.revoked, "Vesting schedule revoked");
        
        uint256 releasableAmount = _releasableAmount(msg.sender);
        require(releasableAmount > 0, "No tokens to release");
        
        schedule.releasedAmount += releasableAmount;
        _transfer(address(this), msg.sender, releasableAmount);
        
        emit TokensReleased(msg.sender, releasableAmount);
    }
    
    function revokeVestingSchedule(address beneficiary) external onlyOwner {
        VestingSchedule storage schedule = vestingSchedules[beneficiary];
        require(schedule.totalAmount > 0, "No vesting schedule found");
        require(schedule.revocable, "Vesting schedule not revocable");
        require(!schedule.revoked, "Vesting schedule already revoked");
        
        uint256 releasableAmount = _releasableAmount(beneficiary);
        if (releasableAmount > 0) {
            schedule.releasedAmount += releasableAmount;
            _transfer(address(this), beneficiary, releasableAmount);
        }
        
        uint256 remainingAmount = schedule.totalAmount - schedule.releasedAmount;
        if (remainingAmount > 0) {
            _transfer(address(this), owner(), remainingAmount);
        }
        
        schedule.revoked = true;
        emit VestingScheduleRevoked(beneficiary);
    }
    
    function _releasableAmount(address beneficiary) internal view returns (uint256) {
        VestingSchedule memory schedule = vestingSchedules[beneficiary];
        
        if (schedule.revoked || schedule.totalAmount == 0) {
            return 0;
        }
        
        uint256 elapsedTime = block.timestamp - schedule.startTime;
        
        if (elapsedTime >= schedule.duration) {
            return schedule.totalAmount - schedule.releasedAmount;
        }
        
        uint256 vestedAmount = (schedule.totalAmount * elapsedTime) / schedule.duration;
        return vestedAmount - schedule.releasedAmount;
    }
    
    // View functions
    function getVestingSchedule(address beneficiary) external view returns (VestingSchedule memory) {
        return vestingSchedules[beneficiary];
    }
    
    function getReleasableAmount(address beneficiary) external view returns (uint256) {
        return _releasableAmount(beneficiary);
    }
    
    // Emergency functions
    function emergencyWithdraw(address token, uint256 amount) external onlyOwner {
        require(token != address(this), "Cannot withdraw native tokens");
        IERC20(token).transfer(owner(), amount);
    }
}