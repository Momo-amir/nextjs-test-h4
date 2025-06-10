module.exports = {
	reactStrictMode: true,
	// expose JWT_SECRET (and any other non-public vars) to Edge Runtimes
	env: {
		JWT_SECRET: process.env.JWT_SECRET,
		CLIENT_ID: process.env.CLIENT_ID,
		CLIENT_SECRET: process.env.CLIENT_SECRET,
	},
	async headers() {
		return [
			{
				source: "/(.*)",
				headers: [
					{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains; preload" },
					{ key: "X-Frame-Options", value: "DENY" },
					{ key: "X-Content-Type-Options", value: "nosniff" },
					{ key: "Referrer-Policy", value: "same-origin" },
				],
			},
		];
	},
};
