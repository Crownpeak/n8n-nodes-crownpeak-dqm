import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	IHttpRequestMethods,
	NodeOperationError,
} from 'n8n-workflow';

export class CrownpeakDQM implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Crownpeak DQM',
		name: 'crownpeakDqm',
		icon: 'file:crownpeak.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Crownpeak DQM CMS API',
		defaults: {
			name: 'Crownpeak DQM',
		},
		inputs: ['main'] as NodeConnectionType[],
		outputs: ['main'] as NodeConnectionType[],
		credentials: [
			{
				name: 'crownpeakDqmApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Create Asset',
						value: 'createAsset',
						action: 'Submit new content asset',
					},
					{
						name: 'Delete Asset',
						value: 'deleteAsset',
						action: 'Delete an existing asset',
					},
					{
						name: 'Get Asset Content',
						value: 'getAssetContent',
						action: 'Get content for a specific asset',
					},
					{
						name: 'Get Asset Details',
						value: 'getAssetDetails',
						action: 'Get details for a specific asset',
					},
					{
						name: 'Get Asset Errors by Checkpoint',
						value: 'getAssetErrorsByCheckpoint',
						action: 'Get asset errors for a specific checkpoint',
					},
					{
						name: 'Get Asset Page Highlights',
						value: 'getAssetPageHighlights',
						action: 'Get asset content with all page highlightable issues',
					},
					{
						name: 'Get Asset Status',
						value: 'getAssetStatus',
						action: 'Check quality status for asset',
					},
					{
						name: 'Get Checkpoint Details',
						value: 'getCheckpointDetails',
						action: 'Get details for a specific checkpoint',
					},
					{
						name: 'Get Spellcheck Issues',
						value: 'getSpellcheckIssues',
						action: 'Fetch spellcheck issues for asset',
					},
					{
						name: 'Get Website Checkpoints',
						value: 'getWebsiteCheckpoints',
						action: 'Get checkpoints for a specific website',
					},
					{
						name: 'Get Website Details',
						value: 'getWebsiteDetails',
						action: 'Get details for a specific website',
					},
					{
						name: 'List Assets',
						value: 'listAssets',
						action: 'List assets',
					},
					{
						name: 'List Checkpoints',
						value: 'listCheckpoints',
						action: 'List all available checkpoints',
					},
					{
						name: 'List Websites',
						value: 'listWebsites',
						action: 'List all available websites',
					},
					{
						name: 'Update Asset',
						value: 'updateAsset',
						action: 'Update an existing content asset',
					},
				],
				default: 'listAssets',
			},
			{
				displayName: 'Asset Identifier',
				name: 'assetId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getAssetDetails', 'getAssetContent', 'getAssetStatus', 'getSpellcheckIssues', 'getAssetErrorsByCheckpoint', 'getAssetPageHighlights', 'updateAsset', 'deleteAsset'],
					},
				},
			},
			{
				displayName: 'Website ID',
				name: 'websiteId',
				type: 'string',
				default: '',
				description: 'The ID of the website to get details or checkpoints for',
				displayOptions: {
					show: {
						operation: ['getWebsiteDetails', 'getWebsiteCheckpoints'],
					},
				},
			},
			{
				displayName: 'Checkpoint ID',
				name: 'checkpointId',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['getAssetErrorsByCheckpoint', 'getCheckpointDetails'],
					},
				},
			},
			{
				displayName: 'Page Content',
				name: 'content',
				type: 'string',
				default: '',
				displayOptions: {
					show: {
						operation: ['createAsset', 'updateAsset'],
					},
				},
			},
			{
				displayName: 'Content Type',
				name: 'contentType',
				type: 'string',
				default: 'text/html; charset=UTF-8',
				displayOptions: {
					show: {
						operation: ['createAsset'],
					},
				},
			},
			{
				displayName: 'Limit',
				name: 'limit',
				type: 'number',
				default: 50,
				description: 'Max number of results to return',
				typeOptions: {
					minValue: 1,
				},
				displayOptions: {
					show: {
						operation: ['listAssets'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: IDataObject[] = [];

		for (let i = 0; i < items.length; i++) {
			const operation = this.getNodeParameter('operation', i) as string;
			const { apiKey, websiteId, baseUrl } = await this.getCredentials('crownpeakDqmApi') as { apiKey: string; websiteId: string; baseUrl: string };

			let content: string;
			let method: IHttpRequestMethods;
			let url = '';
			let headers: IDataObject = {
				'x-api-key': apiKey,
			};
			let body: string | undefined;

			switch (operation) {
				case 'listAssets': {
					const limit = this.getNodeParameter('limit', i) as number;
					const searchParams = new URLSearchParams({ apiKey, websiteId, limit: limit.toString() });
					url = `${baseUrl}/assets?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'listWebsites': {
					const searchParams = new URLSearchParams({ apiKey });
					url = `${baseUrl}/websites?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getWebsiteDetails': {
					const websiteId = this.getNodeParameter('websiteId', i) as string;
					const searchParams = new URLSearchParams({ apiKey });
					url = `${baseUrl}/websites/${websiteId}?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getWebsiteCheckpoints': {
					const websiteId = this.getNodeParameter('websiteId', i) as string;
					const searchParams = new URLSearchParams({ apiKey });
					url = `${baseUrl}/websites/${websiteId}/checkpoints?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'listCheckpoints': {
					const searchParams = new URLSearchParams({ apiKey });
					url = `${baseUrl}/checkpoints?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getAssetDetails': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					const searchParams = new URLSearchParams({ apiKey, websiteId });
					url = `${baseUrl}/assets/${assetId}?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getAssetContent': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					const searchParams = new URLSearchParams({ apiKey, websiteId });
					url = `${baseUrl}/assets/${assetId}/content?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getAssetStatus': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					const searchParams = new URLSearchParams({ apiKey, websiteId });
					url = `${baseUrl}/assets/${assetId}/status?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getSpellcheckIssues': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					const searchParams = new URLSearchParams({ apiKey, websiteId });
					url = `${baseUrl}/assets/${assetId}/spellcheck?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getAssetErrorsByCheckpoint': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					const checkpointId = this.getNodeParameter('checkpointId', i) as string;
					const searchParams = new URLSearchParams({ apiKey, websiteId });
					url = `${baseUrl}/assets/${assetId}/errors/${checkpointId}?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getAssetPageHighlights': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					const searchParams = new URLSearchParams({ apiKey, websiteId });
					url = `${baseUrl}/assets/${assetId}/pagehighlight/all?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'getCheckpointDetails': {
					const checkpointId = this.getNodeParameter('checkpointId', i) as string;
					const searchParams = new URLSearchParams({ apiKey });
					url = `${baseUrl}/checkpoints/${checkpointId}?${searchParams.toString()}`;
					method = 'GET';
					break;
				}
				case 'createAsset': {
					content = this.getNodeParameter('content', i) as string;
					const contentType = this.getNodeParameter('contentType', i) as string;
					method = 'POST';
					const searchParams = new URLSearchParams({ apiKey });
					url = `${baseUrl}/assets?${searchParams.toString()}`;
					headers['Content-Type'] = 'application/x-www-form-urlencoded';
					const bodyParams = new URLSearchParams({ websiteId, content, contentType });
					body = bodyParams.toString();
					break;
				}
				case 'updateAsset': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					content = this.getNodeParameter('content', i) as string;
					method = 'PUT';
					const searchParams = new URLSearchParams({ apiKey });
					url = `${baseUrl}/assets/${assetId}?${searchParams.toString()}`;
					headers['Content-Type'] = 'application/x-www-form-urlencoded';
					const bodyParams = new URLSearchParams({ websiteId, content });
					body = bodyParams.toString();
					break;
				}
				case 'deleteAsset': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					method = 'DELETE';
					const searchParams = new URLSearchParams({ apiKey, websiteId });
					url = `${baseUrl}/assets/${assetId}?${searchParams.toString()}`;
					break;
				}
				default:
					throw new NodeOperationError(this.getNode(), `Unsupported operation: ${operation}`);
			}

			const response = await this.helpers.httpRequest({
				method,
				url,
				headers,
				body,
			});

			returnData.push(response);
		}

		return [this.helpers.returnJsonArray(returnData)];
	}
}
