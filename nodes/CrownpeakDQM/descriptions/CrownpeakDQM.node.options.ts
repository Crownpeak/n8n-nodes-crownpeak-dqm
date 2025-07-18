import { INodeProperties } from 'n8n-workflow';

export const crownpeakDqmNodeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'List Assets',
				value: 'listAssets',
				description: 'Retrieve all available assets for this website',
				action: 'List assets',
			},
			{
				name: 'Get Asset Status',
				value: 'getAssetStatus',
				description: 'Check the current status of an asset',
				action: 'Check quality status for asset',
			},
			{
				name: 'Get Spellcheck Issues',
				value: 'getSpellcheckIssues',
				description: 'Fetch spelling issues identified in the asset',
				action: 'Get spellcheck results for an asset',
			},
			{
				name: 'Create Asset',
				value: 'createAsset',
				description: 'Submit new content to be analyzed',
				action: 'Create a new asset',
			},
			{
				name: 'Update Asset',
				value: 'updateAsset',
				description: 'Update an existing content asset for processing',
				action: 'Update an existing content asset',
			},
		],
		default: 'createAsset',
	},
	{
		displayName: 'Website ID',
		name: 'websiteId',
		type: 'string',
		default: '',
		required: true,
		description: 'The website ID from Crownpeak DQM',
		displayOptions: {
			show: {
				operation: ['createAsset'],
			},
		},
	},
	{
		displayName: 'Content',
		name: 'content',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createAsset'],
			},
		},
		default: '',
		required: true,
		description: 'HTML or plain text content to check',
	},
	{
		displayName: 'Content Type',
		name: 'type',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['createAsset'],
			},
		},
		default: 'html',
		description: 'Type of content (e.g., html, plain)',
	},

	{
		displayName: 'Asset ID',
		name: 'assetId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getAssetStatus', 'getSpellcheckIssues', 'updateAsset'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the asset to query',
	}
];

export const defaults = { name: 'Crownpeak DQM Node' };