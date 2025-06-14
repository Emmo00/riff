// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Counter {
    uint256 private count;

    constructor() {
        count = 0; // Initialize count to zero
    }

    // Function to increment the count
    function increment() external {
        count++;
    }

    // Function to get the current count
    function current() external view returns (uint256) {
        return count;
    }
}