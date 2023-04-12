import './styles.scss';
import 'bootstrap';

import onChange from 'on-change';
import axios from 'axios';
import { setLocale } from 'yup';

import uniqueId from 'lodash/uniqueId.js';
import i18next from 'i18next';
import resources from './locales/index.js';
import render from './view.js';
import validate from './validate.js';
import parser from './parser.js';

const defaultLanguage = 'ru';

const getAxiosResponse = (url) => {
	const allOrigins = 'https://allorigins.hexlet.app';
	const newUrl = new URL(allOrigins);
	newUrl.searchParams.set('url', url);
	newUrl.searchParams.set('disableCache', true); // флаг
	return axios.get(newUrl);
};

const createPosts = (state, newPosts, id) => {
	const preparedPosts = newPosts.forEach((post) => ({ ...post, id }));
	const actualPosts = state.contentValue.posts.concat(preparedPosts);
	return actualPosts;
};

export default () => {
	const i18nInstance = i18next.createInstance();
	i18nInstance.init({
		lng: defaultLanguage,
		debug: false,
		resources,
	}).then(() => {
		const elements = {
			form: document.querySelector('.form'),
			input: document.querySelector('input[id="url-input"]'),
			button: document.querySelector('button[type="submit"]'),
			feedback: document.querySelector('p[class="feedback"]'),
			feedsContainer: document.querySelector('.feeds'),
			postsContainer: document.querySelector('.posts'),
			modal: 1,
		};

		const initialState = {
			valid: true,
			// errors: {},
			// url: '',
			inputValue: '',
			fieldUi: {
				url: false,
			},
			process: {
				processState: 'filling',
				error: null,
			},
			contentValue: {
				posts: [],
				feeds: [],
			},
		};

		const watchedState = onChange(initialState, render(elements, initialState, i18nInstance));

		elements.form.addEventListener('input', (e) => {
			e.preventDefault();
			const data = new FormData(e.target);
			const url = data.get('url').trim();
			// посмотреть что внутри формдата
			// почему берем ключ именно урл?
			// накапливаем влью в сстейте и когда сабмит- проверяем сразу в функции валидейт
			watchedState.inputValue = url;
			watchedState.contentValue.state = 'filling';
			// не изменение в инпуте
		});

		elements.form.addEventListener('submit', (e) => {
			e.preventDefault();

			validate(watchedState, watchedState.inputValue)
				.then(() => {
					watchedState.valid = true;
					watchedState.process.processState = 'sending';
					return getAxiosResponse(watchedState.inputValue);
				})
				.then((response) => {
					const content = response.data.contents;
					const { feed, posts } = parser(content);
					const feedId = uniqueId();

					watchedState.contentValue.feeds.push({ ...feed, feedId });
					createPosts(watchedState, posts, feedId);

					watchedState.process.processState = 'sucsess';
				})
				.catch(() => {
					watchedState.valid = false;
					watchedState.process.error = 'Error';
					watchedState.process.processState = 'error';
				});
		});
	});
};