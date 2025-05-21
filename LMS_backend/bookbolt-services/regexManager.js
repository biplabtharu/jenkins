const constructRegExp = (query) => {
	// Escape special characters in the letters and join them with a pipe (|)
	try {
		// const escapedLetters = letters.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
		const regex = new RegExp(`^${query}`, "i"); // 'i' flag for case-insensitive matching
		return regex;
	} catch (err) {
		throw err;
	}
};

module.exports = {
	constructRegExp,
};
