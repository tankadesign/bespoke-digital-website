import { SANITY_DATASET, SANITY_PROJECT_ID, SANITY_TOKEN } from '$env/static/private';
import type {
	ClientList,
	FeatureCarousel,
	FeatureCarouselSlide,
	Page,
	PageComponents,
	Project,
	ProjectGrid,
	TeamGrid
} from '$lib/types';
import { createClient } from '@sanity/client';
import { error, type Cookies } from '@sveltejs/kit';
import {
	makeSquareThumbnail,
	parseCloudinaryImage,
	parseMediaGroupFromData,
	parseMultiHeroFromData,
	parseProjectFromData,
	parseProjectMediaFromData
} from './parse';

const apiVersion = '2026-03-05';

export function getClient(showDrafts = false) {
	console.log('getClient', { showDrafts, apiVersion });

	return createClient({
		projectId: SANITY_PROJECT_ID,
		dataset: SANITY_DATASET,
		apiVersion,
		token: SANITY_TOKEN,
		useCdn: !showDrafts,
		perspective: showDrafts ? 'drafts' : 'published'
	});
}

export async function getPage(slug: string, cookies: Cookies): Promise<Page | undefined> {
	if (!slug) error(404, 'Page not found');

	const client = getClient(cookies.get('drafts-enabled') === 'true');
	const groq = `*[_type == "page" && slug.current == "${slug}"]{
		_id,
		name,
		"slug": slug.current,
		description,
		"bgColor": bg_color,
		"footerHasContactForm": footer_contact,
		"hero": hero->{
			_type == 'hero' => @{..., project->},
			_type == 'multi_hero' => @{..., heros[]->{..., project->}},
		},
		components[]{
			_type == 'logo_grid_ref' => @->{..., "desktop": desktop.asset->url, "mobile": mobile.asset->url, "desktopMaxWidth": desktop_max_width, "mobileMaxWidth": mobile_max_width},
			_type == 'projects' => @->{...,projects[]->},
			_type == 'project_media_ref' => @->,
			_type == 'text_only_ref' => @->{..., "bgColor": background_color},
			_type == 'text_2col_ref' => @->{..., "useStylizedList": use_stylized_list, "bgColor": background_color},
			_type == 'quote_ref' => @->{..., "bgColor": background_color, "textColor": text_color},
			_type == 'feature_carousel_ref' => @->{..., "bgColor": background_color, "slides": slides[]{..., media->}},
			_type == 'media_group_ref' => @->{..., "media": media[]->{...}},
			_type == 'columned_text_ref' => @->{..., "borderedTitle": bordered_title, "bgColor": background_color},
			_type == 'client_list_ref' => @->{..., "bgColor": background_color},
			_type == 'team_grid_ref' => @->{..., "bgColor": background_color, "extraMembers": extra_members[]->, "extraMembersTitle": extra_members_title},
			_type == 'form_ref' => @->{..., "bgColor": background_color},
		}
	}`;
	const result = await client.fetch(groq);
	if (!result || !result.length) {
		console.log('no result');
		error(404, 'Page not found');
	}
	try {
		const pageData = result[0];
		const page: Page = {
			_type: 'page',
			_id: pageData._id,
			name: pageData.name,
			bgColor: pageData.bgColor?.value,
			slug: pageData.slug,
			metaDescription: pageData.description,
			footerHasContactForm: Boolean(pageData.footerHasContactForm ?? true),
			heros: parseMultiHeroFromData(pageData.hero),
			components: await getComponents(pageData.components)
		};

		return page;
	} catch (err) {
		console.log('fetch error', (err as Error).message);
		error(403, (err as Error).message);
	}
}

async function getComponents(components: any): Promise<PageComponents> {
	if (!components) return [];
	const comps: PageComponents = [];
	for (const component of components) {
		if (component._type === 'project_grid') {
			const projects: Project[] = [];
			if (component.projects && Array.isArray(component.projects)) {
				for (const project of component.projects) {
					const p = parseProjectFromData(project);
					if (p) projects.push(p);
				}
			}
			const grid: ProjectGrid = {
				_type: 'project_grid',
				name: component.name,
				title: component.title,
				moreLink: component.more_link?.url
					? {
							buttonTitle: component.more_link.button_title,
							url: component.more_link.url
						}
					: undefined,
				useFeature: component.feature_first ?? false,
				disableGrid: component.feature_all === true,
				columns: component.columns ?? 'two',
				projects
			};
			comps.push(grid);
		} else if (component._type === 'project_media') {
			const p = parseProjectMediaFromData(component);
			if (p) comps.push(p);
		} else if (component._type === 'feature_carousel') {
			const featureCarousel: FeatureCarousel = {
				_type: 'feature_carousel',
				title: component.title,
				description: component.description,
				slides: (component.slides ?? []).map(
					(slide: any) =>
						({
							title: slide.title ?? '',
							image: slide.media ? undefined : parseCloudinaryImage(slide.image),
							media: slide.media ? parseProjectMediaFromData(slide.media) : undefined,
							body: slide.body,
							bodyTruncated: slide.body_truncated,
							hasButton: slide.has_button ?? false,
							buttonTitle: slide.button_title ?? '',
							buttonUrl: slide.button_url ?? ''
						}) as FeatureCarouselSlide
				),
				bgColor: component.bgColor ?? component.background_color
			};
			comps.push(featureCarousel);
		} else if (component._type === 'client_list') {
			const clients: ClientList = {
				_type: 'client_list',
				title: component.title,
				clients: component.clients.replace(/\n\s*\n+/g, '\n').split('\n'),
				bgColor: component.bg_color
			};
			comps.push(clients);
		} else if (component._type === 'team_grid') {
			const team: TeamGrid = {
				_type: 'team_grid',
				title: component.title,
				description: component.description,
				members: component.members.map((m: any) => {
					m.image = makeSquareThumbnail(m.image);
					return m;
				}),
				extraMembersTitle: component.extra_members_title,
				extraMembers: component.extra_members,
				bgColor: component.bg_color ?? 'transparent'
			};
			comps.push(team);
		} else if (component._type === 'media_group') {
			comps.push(parseMediaGroupFromData(component));
		} else if (
			['form', 'logo_grid', 'text_only', 'text_2col', 'quote', 'columned_text'].includes(
				component._type
			)
		) {
			comps.push(component);
		} else {
			console.log('unknown component', component);
		}
	}
	return comps;
}
