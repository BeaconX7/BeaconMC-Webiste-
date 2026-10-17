/**
 * ============================================================================
 * BeaconMC Official Staff Configuration
 * ============================================================================
 * 
 * To edit staff details, simply update the fields below:
 *   - minecraftIGN : Minecraft in-game username
 *   - discordID    : Discord username or tag (leave as "" to cleanly hide this row)
 *   - avatar       : Avatar image URL (leave as "" to use the clean default placeholder)
 * 
 * Official Roles & Order:
 *   1. Owner
 *   2. Founder
 *   3. Co-Owner
 *   4. Co-Founder
 *   5. Admin
 *   6. Mod
 *   7. Staff
 *   8. Builder
 *   9. Helper
 * ============================================================================
 */

const staffMembers = [
  {
    role: "Owner",
    minecraftIGN: "BeaconX7",
    discordID: "beaconx7",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554024043433164850/avatar-3d-bust.png?ex=6ad3c4ec&is=6ad2736c&hm=c57ebf119f39e591bbb0f1250bfa599f7ceb6958b6e67b035321e0ff446d0cdc&"
  },
  {
    role: "Founder",
    minecraftIGN: "AshuX7",
    discordID: "ashugautam0849",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554025193637154856/avatar-3d-bust_1.png?ex=6ad3c5fe&is=6ad2747e&hm=a65572d1354876c71b4d35957ba0f96d9b702db9d49688f7f4272dba63a1c4e1&"
  },
  {
    role: "Co-Owner",
    minecraftIGN: "EnvyQueen",
    discordID: "pro_mahiru",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554480144029188226/avatar-3d-bust_7.png?ex=6ad37373&is=6ad221f3&hm=f5c0c62cbe1310eef39606592193a28bbf63a1ab632f2d9678a71a27d69863f3&"
  },
  {
    role: "Co-Founder",
    minecraftIGN: "Echo_X1",
    discordID: "echo_x1__58783",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554031930314457148/avatar-3d-bust_3.png?ex=6ad3cc44&is=6ad27ac4&hm=8db9b34c106886d75274f75ebaf7192f2d6b83de252263a873880ff4f0010da2&"
  },
  {
    role: "Admin",
    minecraftIGN: "AuraManav",
    discordID: "manavsoni980",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554482060184256552/avatar-3d-bust_8.png?ex=6ad3753c&is=6ad223bc&hm=2040753265b1e034f413062bb6dd2167eb6e036724376fd0c5867999346880e9&"
  },
  {
    role: "Mod",
    minecraftIGN: "RoronoaZORO_18",
    discordID: "togxsaber",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554026146981617694/avatar-3d-bust_2.png?ex=6ad3c6e1&is=6ad27561&hm=c1ae29aaa1796e758f6588097cf6ef90304ade0df25d810e707a571b3d99ad99&"
  },
  {
    role: "Staff",
    minecraftIGN: "_ishaaaaaaa",
    discordID: "its_ishaa0979",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554037951418343424/avatar-3d-bust_4.png?ex=6ad3d1e0&is=6ad28060&hm=bd16ba47766b5e60669dbbbeffb2168fb6bc6136a54a040a36280f866902fbc3&"
  },
  {
    role: "Builder",
    minecraftIGN: "Kunal_V",
    discordID: "kunal03790",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1554479378430173234/avatar-3d-bust_5.png?ex=6ad372bc&is=6ad2213c&hm=de50c1f87c6cd365219838af56dfebd3d2d0d62eb08b3a2be1048c58038ac7cb&"
  },
  {
    role: "Helper",
    minecraftIGN: "Diya156",
    discordID: "Unavailable",
    avatar: "https://cdn.discordapp.com/attachments/1518821969498210378/1560797381124161617/avatar-3d-bust.png?ex=6ad40555&is=6ad2b3d5&hm=b52459fe44cc615a6df3b51850634b18e61ca2f2380dab44ba0cd12987728eb0&"
  }
];

// Expose on global window object for browser access
if (typeof window !== 'undefined') {
  window.staffMembers = staffMembers;
}

// Support Node.js / module environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = staffMembers;
}
