const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Riff", function () {
  let Riff, riff, MockERC20, token;
  let owner, user1, user2, other;

  const DEFAULT_FEES = {
    play: ethers.utils.parseEther("1"),
    like: ethers.utils.parseEther("2"),
    comment: ethers.utils.parseEther("3"),
    banger: ethers.utils.parseEther("4"),
  };

  beforeEach(async function () {
    [owner, user1, user2, other] = await ethers.getSigners();

    MockERC20 = await ethers.getContractFactory("MockERC20");
    token = await MockERC20.deploy("TestToken", "TT", 18);
    await token.mint(user1.address, ethers.utils.parseEther("1000"));
    await token.mint(user2.address, ethers.utils.parseEther("1000"));

    Riff = await ethers.getContractFactory("Riff");
    riff = await Riff.deploy(
      token.address,
      DEFAULT_FEES.play,
      DEFAULT_FEES.like,
      DEFAULT_FEES.comment,
      DEFAULT_FEES.banger
    );

    await token
      .connect(user1)
      .approve(riff.address, ethers.constants.MaxUint256);
    await token
      .connect(user2)
      .approve(riff.address, ethers.constants.MaxUint256);
  });

  describe("Profile Management", function () {
    it("should register and update a profile", async function () {
      await riff.connect(user1).registerProfile("User1", "Artist Bio");
      const profile = await riff.getProfile(user1.address);
      expect(profile.name).to.equal("User1");

      await riff.connect(user1).updateProfile("User1 Updated", "New Bio");
      const updated = await riff.getProfile(user1.address);
      expect(updated.bio).to.equal("New Bio");
    });

    it("should fail to register twice", async function () {
      await riff.connect(user1).registerProfile("User1", "Bio");
      await expect(
        riff.connect(user1).registerProfile("Again", "Nope")
      ).to.be.revertedWith("Profile already exists");
    });
  });

  describe("Track Management", function () {
    beforeEach(async () => {
      await riff.connect(user1).registerProfile("Artist", "Cool Bio");
    });

    it("should upload and delete a track", async () => {
      const tx = await riff
        .connect(user1)
        .uploadTrack("cid123", "Song Title", "My first song");
      const receipt = await tx.wait();
      const trackId = receipt.events.find((e) => e.event === "TrackUploaded")
        .args.trackId;

      let track = await riff.getTrack(trackId);
      expect(track.title).to.equal("Song Title");

      await riff.connect(user1).deleteTrack(trackId);
      track = await riff.getTrack(trackId);
      expect(track.deleted).to.equal(true);
    });

    it("should not allow non-artist to delete track", async () => {
      const tx = await riff
        .connect(user1)
        .uploadTrack("cid123", "Track", "Desc");
      const { trackId } = await tx
        .wait()
        .then((r) => r.events.find((e) => e.event === "TrackUploaded").args);
      await expect(riff.connect(user2).deleteTrack(trackId)).to.be.revertedWith(
        "Only track owner can delete"
      );
    });
  });

  describe("Action & Payments", function () {
    let trackId;

    beforeEach(async () => {
      await riff.connect(user1).registerProfile("User1", "Artist");
      await riff.connect(user2).registerProfile("User2", "Listener");
      const tx = await riff.connect(user1).uploadTrack("cid", "Title", "Desc");
      trackId = (await tx.wait()).events.find(
        (e) => e.event === "TrackUploaded"
      ).args.trackId;
    });

    it("should pay artist for play action", async () => {
      const actionData = ethers.utils.defaultAbiCoder.encode(
        ["string", "bytes"],
        ["play", "0x"]
      );

      await riff.connect(user2).recordAction(trackId, actionData);

      const earnings = await riff.viewTrackEarnings(trackId);
      expect(earnings).to.be.gt(0);
    });

    it("should allow comments with payment", async () => {
      const payload = ethers.utils.defaultAbiCoder.encode(
        ["string"],
        ["Nice track!"]
      );
      const actionData = ethers.utils.defaultAbiCoder.encode(
        ["string", "bytes"],
        ["comment", payload]
      );

      await riff.connect(user2).recordAction(trackId, actionData);
      const comments = await riff.getTrackComments(trackId);
      expect(comments.length).to.equal(1);
      expect(comments[0].message).to.equal("Nice track!");
    });

    it("should allow withdrawal of earnings", async () => {
      const actionData = ethers.utils.defaultAbiCoder.encode(
        ["string", "bytes"],
        ["like", "0x"]
      );
      await riff.connect(user2).recordAction(trackId, actionData);

      const before = await token.balanceOf(user1.address);
      await riff.connect(user1).withdrawTrackEarnings(trackId);
      const after = await token.balanceOf(user1.address);
      expect(after).to.be.gt(before);
    });
  });

  describe("Contributor Logic", () => {
    let trackId;

    beforeEach(async () => {
      await riff.connect(user1).registerProfile("Main", "Bio");
      await riff.connect(user2).registerProfile("Contributor", "Bio");
      const tx = await riff
        .connect(user1)
        .uploadTrack("cid", "with Contributor", "desc");
      trackId = (await tx.wait()).events.find(
        (e) => e.event === "TrackUploaded"
      ).args.trackId;
    });

    it("should add and configure a contributor", async () => {
      await riff.connect(user1).addContributor(trackId, user2.address, 1000); // 10%
      let contributors = await riff.getTrackContributors(trackId);
      expect(contributors.length).to.equal(1);
      expect(contributors[0].contributor).to.equal(user2.address);

      await riff
        .connect(user1)
        .configureContributor(trackId, user2.address, 1500); // 15%
      contributors = await riff.getTrackContributors(trackId);
      expect(contributors[0].percentage).to.equal(1500);
    });

    it("should split earnings with contributor", async () => {
      await riff.connect(user1).addContributor(trackId, user2.address, 5000); // 50%
      const actionData = ethers.utils.defaultAbiCoder.encode(
        ["string", "bytes"],
        ["play", "0x"]
      );
      await riff.connect(user2).recordAction(trackId, actionData);

      const artistShare = await riff
        .viewTrackEarnings(trackId)
        .then(() => riff.trackEarnings(trackId, user1.address));
      const contribShare = await riff.trackEarnings(trackId, user2.address);

      expect(artistShare).to.be.closeTo(
        contribShare,
        ethers.utils.parseEther("0.01")
      );
    });
  });

  describe("Admin Functions", () => {
    it("should allow owner to withdraw platform fees", async () => {
      await riff.connect(user1).registerProfile("user", "bio");
      await riff.connect(user2).registerProfile("listener", "bio");

      const tx = await riff.connect(user1).uploadTrack("cid", "title", "desc");
      const trackId = (await tx.wait()).events.find(
        (e) => e.event === "TrackUploaded"
      ).args.trackId;

      const actionData = ethers.utils.defaultAbiCoder.encode(
        ["string", "bytes"],
        ["play", "0x"]
      );
      await riff.connect(user2).recordAction(trackId, actionData);

      const before = await token.balanceOf(owner.address);
      await riff.connect(owner).withdrawPlatformFees();
      const after = await token.balanceOf(owner.address);
      expect(after).to.be.gt(before);
    });
  });
});
