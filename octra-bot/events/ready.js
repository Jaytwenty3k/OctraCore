// events/ready.js
module.exports = {
  execute(client) {
    console.log(`✅ Bot ist online als ${client.user.tag}`);
  },
};