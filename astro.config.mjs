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
			sidebar: [
				{
					label: 'ガイド',
					items: [
						'guides',
						'guides/quickstart',
					],
				},
				{
					label: 'リファレンス',
					items: [
						{
							label: 'Spec Kitコマンドリファレンス',
							items: [
								'reference/command-reference-overview',
								'reference/command-reference-reading-guide',
								'reference/command-reference-constitution-specify-clarify',
								'reference/command-reference-checklist',
								'reference/command-reference-plan-tasks-analyze',
								'reference/command-reference-implement',
							],
						},
					],
				},
				{
					label: '運用ガイド',
					items: [
						'operations/docs-sync',
						'operations',
					],
				},
				{
					label: '調査ノート',
					autogenerate: { directory: 'research' },
				},
			],
		}),
	],
});
