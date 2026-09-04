//@ts-expect-error - this exists
import type { InputValue } from '@portabletext/svelte/ptTypes';

export interface CloudinaryImage {
	url: string;
	sizes?: {
		sm: string;
		md: string;
		lg: string;
	};
	width: number;
	height: number;
}

export interface Credit {
	name: string;
	credit: string;
}

export interface MultiHero {
	_type: 'multi_hero';
	_id: string;
	name: string;
	title?: string;
	subtitle?: string;
	heros: Hero[];
}

export interface Project {
	_type: 'project';
	_id: string;
	name: string;
	title: string;
	titleHidden?: boolean;
	shortName: string;
	metaDescription: string;
	slug: string;
	pageTitle?: string;
	kind?: 'image' | 'video-bg';
	description?: InputValue;
	descriptionIntro?: InputValue;
	client?: string;
	credits?: Credit[];
	image?: CloudinaryImage;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
	media?: Array<
		ProjectMedia | ProjectMediaPair | TextOnly | Text2Column | ColumnedText | MediaGroup | Quote
	>;
	bgColor?: string;
	tags?: string[];
	relatedProjects?: Project[];
	showRelatedProjects?: boolean;
	relatedProjectsBgColor?: string;
}
export interface ProjectGrid {
	_type: 'project_grid';
	name: string;
	title?: string;
	useFeature: boolean;
	disableGrid?: boolean;
	columns?: 'two' | 'three';
	moreLink?: {
		buttonTitle: string;
		url: string;
	};
	projects: Project[];
}
export interface Hero {
	_type: 'hero';
	_id: string;
	name: string;
	subtitle?: string;
	kind?: 'image' | 'video-bg';
	image_desktop?: CloudinaryImage;
	image_mobile?: CloudinaryImage;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
	project?: Project;
}

export type PageComponents = Array<
	| ProjectGrid
	| LogoGrid
	| ProjectMedia
	| TextOnly
	| ColumnedText
	| ClientList
	| FeatureCarousel
	| Form
	| TeamGrid
	| Text2Column
	| Quote
	| MediaGroup
>;

export interface Page {
	_type: 'page';
	_id: string;
	name: string;
	bgColor?: string;
	slug: string;
	footerHasContactForm: boolean;
	metaDescription?: string;
	heros?: MultiHero;
	components?: PageComponents;
}

export interface ProjectMedia {
	_type: 'project_media';
	_id: string;
	name: string;
	image?: CloudinaryImage;
	kind?: 'image' | 'video-bg' | 'video-player' | 'vimeo-player';
	videoPlayerSrc?: string;
	videoBgSrc?: string;
	videoBgSrcHd?: string;
	useOriginalQuality: boolean;
	autoplay: boolean;
	vimeoPlayerId?: string;
}

export interface ProjectMediaPair {
	_type: 'item_pair';
	left: ProjectMedia;
	right: ProjectMedia;
}

export interface Social {
	name: string;
	_type: 'social';
	url: string;
	icon: string;
}

export interface Location {
	name: string;
	_type: 'location';
	address: string;
	email: string;
	timezone: string;
}

export interface MenuItem {
	title: string;
	slug: string;
	children?: MenuItem[];
}

export interface Solutions {
	title: string;
	body: InputValue;
}

export interface Config {
	_type: 'config';
	menu: MenuItem[];
	socials: { name: string; links: Social[] };
	locations: Location[];
	solutions: Solutions;
	newsletterFormTitle: string;
	borderRadius: number;
}

export interface LogoGrid {
	_type: 'logo_grid';
	title: string;
	desktop: string;
	mobile: string;
	color: string;
	mobileMaxWidth: number;
	desktopMaxWidth: number;
}

export interface FeatureCarousel {
	_type: 'feature_carousel';
	title?: string;
	description?: InputValue;
	slides: FeatureCarouselSlide[];
	bgColor: SectionBackgroundColor;
}

export interface FeatureCarouselSlide {
	title: string;
	image?: CloudinaryImage;
	media?: ProjectMedia;
	body: InputValue;
	bodyTruncated?: InputValue;
	hasButton?: boolean;
	buttonTitle?: string;
	buttonUrl?: string;
}

export interface Quote {
	_type: 'quote';
	quote: string;
	byline: string;
	image?: CloudinaryImage;
	textColor: SectionTextColor;
}

export interface TextOnly {
	_type: 'text_only';
	title: string;
	body: InputValue;
	bgColor: SectionBackgroundColor;
}

export interface Text2Column {
	_type: 'text_2col';
	col1: InputValue;
	col2: InputValue;
	indented: boolean;
	useStylizedList: boolean;
	bgColor: SectionBackgroundColor;
}

export interface ColumnedText {
	_type: 'columned_text';
	title: string;
	pre_title: string;
	borderedTitle: boolean;
	indented: boolean;
	body: {
		title: string;
		body: InputValue;
		button: {
			button_title: string;
			button_url: string;
		};
	}[];
	bgColor: SectionBackgroundColor;
}

export interface MediaGroup {
	_type: 'media_group';
	_id: string;
	name: string;
	title?: string;
	description?: InputValue;
	textAlign?: 'centered' | 'left';
	collapseMargin?: boolean;
	layout?:
		| 'one_two'
		| 'two_one'
		| 'three_one'
		| 'one_three'
		| 'one_full'
		| 'two'
		| 'three'
		| 'four'
		| 'one_half_half'
		| 'half_half_one'
		| 'complex_grid_1'
		| 'complex_grid_2'
		| 'complex_grid_3'
		| 'complex_grid_4'
		| 'complex_grid_5'
		| 'complex_grid_6'
		| 'single'
		| 'one_text'
		| 'text_one';
	media?: ProjectMedia[];
}

export interface ClientList {
	_type: 'client_list';
	title: string;
	clients: string[];
	bgColor: SectionBackgroundColor;
}

export interface TeamGrid {
	_type: 'team_grid';
	title: string;
	description: InputValue;
	members: TeamMember[];
	extraMembersTitle: string;
	extraMembers: TeamMember[];
	bgColor: SectionBackgroundColor;
}

export interface TeamMember {
	name: string;
	title: string;
	image?: CloudinaryImage;
}

export interface Form {
	_type: 'form';
	_id: string;
	title: string;
	body: InputValue;
	form: FormType;
	bgColor: SectionBackgroundColor;
}

export type FormType = 'contact' | 'job';
export type SectionBackgroundColor = 'transparent' | 'dark' | 'darker';
export type SectionTextColor = 'white' | 'green';
