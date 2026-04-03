module.exports = {
	config: {
		name: "troll",
		version: "1.0",
		author: "you + chatgpt",
		category: "events"
	},

	onStart: async ({ event, message, api }) => {
		// only run on normal messages
		if (!event.body) return async () => {};

		return async function () {
			const { threadID, senderID, body } = event;

			// prevent bot replying to itself
			if (senderID == api.getCurrentUserID()) return;

			const msg = body.toLowerCase();

			// ===== INIT GLOBAL STORAGE =====
			if (!global.trollReplies) global.trollReplies = {};
			if (!global.trollStatus) global.trollStatus = {};
			if (!global.lastReplyTime) global.lastReplyTime = {};

			if (!global.trollReplies[threadID]) global.trollReplies[threadID] = [];
			if (global.trollStatus[threadID] === undefined) global.trollStatus[threadID] = false;

			// =========================
			// 🟢 START / STOP
			// =========================
			if (msg === "start") {
				global.trollStatus[threadID] = true;
				return message.send("trolling is now ON 😈");
			}

			if (msg === "stop") {
				global.trollStatus[threadID] = false;
				return message.send("trolling is now OFF 😴");
			}

			// =========================
			// ➕ ADD MULTIPLE REPLIES
			// andar joke1, joke2, joke3
			// =========================
			if (msg.startsWith("andar ")) {
				const content = body.slice(6).trim();

				if (!content) {
					return message.send("lagay ka ng jokes after andar");
				}

				const newReplies = content
					.split(",")
					.map(r => r.trim())
					.filter(r => r);

				global.trollReplies[threadID].push(...newReplies);

				return message.send(`added ${newReplies.length} troll replies 😈`);
			}

			// =========================
			// 🤖 AUTO REPLY TO ALL (6s cooldown)
			// =========================
			if (!global.trollStatus[threadID]) return;

			const replies = global.trollReplies[threadID];
			if (!replies.length) return;

			const now = Date.now();
			const cooldown = 6000;

			if (
				global.lastReplyTime[threadID] &&
				now - global.lastReplyTime[threadID] < cooldown
			) return;

			global.lastReplyTime[threadID] = now;

			const randomReply = replies[Math.floor(Math.random() * replies.length)];

			message.reply(randomReply);
		};
	}
};
