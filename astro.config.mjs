// @ts-check
import { defineConfig } from 'astro/config';
import mermaid from 'astro-mermaid';
import starlight from '@astrojs/starlight';

const site = 'https://rising3.github.io';
const base = '/speckit-guide';

// https://astro.build/config
export default defineConfig({
	site,
	base,
	integrations: [
		mermaid(),
		starlight({
			title: 'Spec Kit Guide',
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/rising3/speckit-guide' }],
			editLink: {
				baseUrl: 'https://github.com/rising3/speckit-guide/edit/next/',
			},
			sidebar: [
				{
					label: 'ガイド',
					autogenerate: { directory: 'guides' },
				},
				{
					label: 'リファレンス',
					autogenerate: { directory: 'reference' },
				},
			],
		}),
	],
});
