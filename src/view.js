const renderPosts = (state, div) => {
	const ul = document.createElement('ul');
	ul.classList.add('list-group', 'border-0', 'rounded-0');

	state.posts.forEach((post) => {
		const li = document.createElement('li');
		li.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

		const a = document.createElement('a');
		a.classList.add('fw-bold');
		a.setAttribute('href', post.link);
		a.setAttribute('data-id', 'достать из post');
		a.setAttribute('targer', '_blank');
		a.setAttribute('rel', 'noopener noreferrer');
		a.textContent(post.description);

		const button = document.createElement('button');
		button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
		button.setAttribute('type', 'button');
		button.setAttribute('data-id', 'достать из post');
		button.setAttribute('data-bs-toggle', 'modal');
		button.setAttribute('data-bs-target', '#modal');
		a.textContent('Просмотр');
	});

	div.append(ul);
};

const renderFeeds = (state, div) => {
	const ul = document.createElement('ul');
	ul.classList.add('list-group', 'border-0', 'rounded-0');

	state.feeds.forEach((feed) => {
		const li = document.createElement('li');
		li.classList.add('list-group-item', 'border-0', 'border-end-0');

		const h3 = document.createElement('h3');
		h3.classList.add('h6', 'm-0');
		h3.textContent(feed.title);

		const p = document.createElement('p');
		p.classList.add('m-0', 'small', 'text-black-50');
		p.textContent(feed.description);

		li.append(h3);
		li.append(p);
		ul.append(li);
	});

	div.append(ul);
};

const createContainer = (type, state) => {
	const divCardContainer = document.createElement('div');
	if (type === 'posts') {
		divCardContainer.classList.add('col-md-10', 'col-lg-8', 'order-1', 'mx-auto', 'posts');
	} else {
		divCardContainer.classList.add('col-md-10', 'col-lg-4', 'mx-auto', 'order-0', 'order-lg-1', 'feeds');
	}

	const divCard = document.createElement('div');
	divCard.classList.add('card', 'border-0');

	const divCardBody = document.createElement('div');
	divCardBody.classList.add('card-body');
	if (type === 'posts') {
		divCardBody.innerHTML('<h2 class="card-title h4">Посты</h2>');
	} else {
		divCardBody.innerHTML('<h2 class="card-title h4">Фиды</h2>');
	}

	divCard.append(divCardBody);
	divCardContainer.append(divCard);

	if (type === 'posts') {
		renderPosts(state, divCard);
	} else {
		renderFeeds(state, divCard);
	}
};

const handleSuccessFinish = (elements, state) => {
	const feedbackField = elements.feedback;
	feedbackField.classList.remove('text-danger');
	feedbackField.classList.add('text-success');
	feedbackField.textContent = 'RSS успешно загружен';

	const btn = elements.button;
	btn.removeAttribute('disabled');

	const inputField = elements.input;
	inputField.removeAttribute('readonly');
	inputField.focus();

	createContainer('posts', state);
	createContainer('feeds', state);
};

const handleFinishWitnError = (elements, state) => {

};

const handlerProcessState = (elements, state, processState) => {
	switch (processState) {
		case 'sucsess':
			handleSuccessFinish(elements, state);
			break;
		case 'error':
			handleFinishWitnError(elements, state);
			break;
		case 'sending':
			elements.button.getAttribute('disabled');
			elements.input.getAttribute('readonly');
			break;
		default:
			throw new Error(`Unknown process state: ${processState}`);
	}
};

export default (elements, state, i18nInstance) => (path, value) => {
	switch (path) {
		case 'process.processState':
			handlerProcessState(elements, state, state.process.processState);
			break;

		case 'process.error':
			handleFinishWitnError();
			break;

		case 'contentValue.posts':
			createContainer('posts', state);
			break;

		case 'contentValue.feeds':
			createContainer('feeds', state);
			break;

		default:
			break;
	}
};