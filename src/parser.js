export default (data) => {
	const parser = new DOMParser();
	const parsedData = parser.parseFromString(data, 'application/xml');

	const channel = parsedData.querySelector('channel');
	const feedTitle = channel.querySelector('title');
	const feedDescription = channel.querySelector('description');
	const feedLink = channel.querySelector('link');
	const feed = { title: feedTitle, description: feedDescription, link: feedLink };

	const items = Array.from(parsedData.querySelectorAll('item'));

	const posts = items.map((item) => {
		const title = item.querySelector('title');
		const description = item.querySelector('description');
		const link = item.querySelector('link');

		return { title, description, link };
	});

	return { feed, posts };
};