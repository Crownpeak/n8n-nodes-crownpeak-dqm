import { INodeProperties } from 'n8n-workflow';

export const crownpeakDqmNodeDescription: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		options: [
			{
				name: 'Create Asset',
				value: 'createAsset',
				description: 'Submit new content to be analyzed',
				action: 'Create a new asset',
			},
			{
				name: 'Delete Asset',
				value: 'deleteAsset',
				description: 'Delete an existing asset from the system',
				action: 'Delete an existing asset',
			},
			{
				name: 'Get Asset Content',
				value: 'getAssetContent',
				description: 'Get the actual content (HTML/text) for a specific asset',
				action: 'Get content for a specific asset',
			},
			{
				name: 'Get Asset Details',
				value: 'getAssetDetails',
				description: 'Get detailed information for a specific asset',
				action: 'Get details for a specific asset',
			},
			{
				name: 'Get Asset Errors by Checkpoint',
				value: 'getAssetErrorsByCheckpoint',
				description: 'Get asset content highlighting issues for a specific checkpoint',
				action: 'Get asset errors for a specific checkpoint',
			},
			{
				name: 'Get Asset Page Highlights',
				value: 'getAssetPageHighlights',
				description: 'Get asset content with all page highlightable issues (beta feature)',
				action: 'Get asset content with page highlights',
			},
			{
				name: 'Get Asset Status',
				value: 'getAssetStatus',
				description: 'Check the current status of an asset',
				action: 'Check quality status for asset',
			},
			{
				name: 'Get Checkpoint Details',
				value: 'getCheckpointDetails',
				description: 'Get detailed information for a specific checkpoint',
				action: 'Get details for a specific checkpoint',
			},
			{
				name: 'Get Spellcheck Issues',
				value: 'getSpellcheckIssues',
				description: 'Fetch spelling issues identified in the asset',
				action: 'Get spellcheck results for an asset',
			},
			{
				name: 'Get Website Checkpoints',
				value: 'getWebsiteCheckpoints',
				description: 'Get all checkpoints available for a specific website',
				action: 'Get checkpoints for a specific website',
			},
			{
				name: 'Get Website Details',
				value: 'getWebsiteDetails',
				description: 'Get detailed information for a specific website',
				action: 'Get details for a specific website',
			},
			{
				name: 'List Assets',
				value: 'listAssets',
				description: 'Retrieve all available assets for this website',
				action: 'List assets',
			},
			{
				name: 'List Checkpoints',
				value: 'listCheckpoints',
				description: 'Retrieve all available quality check checkpoints',
				action: 'List all available checkpoints',
			},
			{
				name: 'List Websites',
				value: 'listWebsites',
				description: 'Retrieve all available websites you have access to',
				action: 'List all available websites',
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
				operation: ['createAsset', 'getWebsiteDetails', 'getWebsiteCheckpoints'],
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
				operation: ['getAssetDetails', 'getAssetContent', 'getAssetStatus', 'getSpellcheckIssues', 'getAssetErrorsByCheckpoint', 'getAssetPageHighlights', 'updateAsset', 'deleteAsset'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the asset to query',
	},

	{
		displayName: 'Checkpoint ID',
		name: 'checkpointId',
		type: 'string',
		displayOptions: {
			show: {
				operation: ['getAssetErrorsByCheckpoint', 'getCheckpointDetails'],
			},
		},
		default: '',
		required: true,
		description: 'ID of the checkpoint to get errors for',
	}
];

export const defaults = { name: 'Crownpeak DQM Node' };