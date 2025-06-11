module.exports = {
	reactStrictMode: true,
	env: {
		JWT_SECRET: process.env.JWT_SECRET,
		CLIENT_ID: process.env.CLIENT_ID,
		CLIENT_SECRET: process.env.CLIENT_SECRET,
	},

	// 1) HTTPS-redirect - not working as intended
	async redirects() {
		return [
			{
				source: "/:path*",
				has: [
					{
						type: "header",
						key: "x-forwarded-proto",
						value: "http",
					},
				],
				permanent: true,
				destination: "https://:path*",
			},
		];
	},

	// 2) Security headers
	// TODO: This is a basic setup from nextjs documentation. - For real applications, review strategy for project specific needs.
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
