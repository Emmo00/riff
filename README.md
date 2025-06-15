# Riff

The future of music is open and easy.

---

# Problem Statement

The current music streaming industry suffers from a lack of transparency and fairness in artist compensation. Musicians often receive delayed, opaque payments while fans have no direct way to financially support artists beyond passive listening. Additionally, existing platforms do not incentivize meaningful fan engagement.

---

# Solution Overview

Riff is a decentralized music streaming platform that leverages Metis Hyperion’s real-time Layer 2 blockchain to tokenize every user interaction—plays, likes, shares—into instant, transparent micropayments to artists. By embedding AI co-agents within the platform, Riff delivers personalized recommendations and dynamic tipping policies, fostering deeper engagement. This approach transforms passive consumption into active participation, ensuring fair and immediate rewards for artists while offering fans a richer, AI-enhanced experience.

---

# Project Description

Riff redefines music streaming by combining blockchain transparency with AI-driven interactivity on Metis Hyperion. Musicians upload tracks stored securely on decentralized storage like IPFS, while fans stream and interact through a slick, responsive frontend. Every user action—listening, liking, sharing—is recorded onchain and triggers automatic microtransactions to artists, benefiting from Hyperion’s instant transaction finality and high throughput.

The integration of AI co-agents empowers Riff to provide smart playlist curation, user behavior analysis, and adaptive tipping policies that respond to fan engagement patterns in real time. This AI-native feature enhances discoverability and creates a more rewarding ecosystem for both artists and listeners.

The platform’s blend of real-time blockchain execution, AI automation, and community-driven incentives excites us because it builds a truly open, equitable future for music where fans and creators thrive together.

Here’s a disciplined and future-proof structure for the **track metadata** uploaded to IPFS in your app (`Riff`). It aligns with open media metadata standards, supports rich features like contributors, and is easily expandable:

---

### 🗂️ Track Metadata Structure (JSON)

```json
{
  "version": "1.0.0",
  "type": "music-track",
  "title": "Euphoria",
  "description": "An energetic electronic beat inspired by the 90s.",
  "genre": "Electronic",
  "duration": 212,                     // In seconds
  "coverImage": "ipfs://CID/cover.jpg",
  "audio": "ipfs://CID/audio.mp3",
  "bpm": 128,                          // Optional
  "key": "C#m",                        // Optional
  "releaseDate": "2025-06-01T00:00:00Z",

  "artist": {
    "address": "0xArtistAddress",
    "name": "Syntha"
  },

  "tags": ["electronic", "90s", "banger"],
  "lyrics": "",                        // Optional, plain text or markdown

//   "external": {
//     "spotify": "https://...",
//     "youtube": "https://...",
//     "website": "https://..."
//   }
}
```
