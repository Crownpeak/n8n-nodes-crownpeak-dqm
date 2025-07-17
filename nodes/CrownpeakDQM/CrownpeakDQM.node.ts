import {
	IDataObject,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	IExecuteFunctions,
	IHttpRequestMethods
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
						name: 'List Assets',
						value: 'listAssets',
						action: 'List assets',
					},
					{
						name: 'Get Asset Details',
						value: 'getAssetDetails',
						action: 'Get details for a specific asset',
					},
					{
						name: 'Get Asset Content',
						value: 'getAssetContent',
						action: 'Get content for a specific asset',
					},
					{
						name: 'Get Asset Status',
						value: 'getAssetStatus',
						action: 'Check quality status for asset',
					},
					{
						name: 'Get Spellcheck Issues',
						value: 'getSpellcheckIssues',
						action: 'Fetch spellcheck issues for asset',
					},
					{
						name: 'Create Asset',
						value: 'createAsset',
						action: 'Submit new content asset',
					},
					{
						name: 'Update Asset',
						value: 'updateAsset',
						action: 'Update an existing content asset',
					},
					{
						name: 'Delete Asset',
						value: 'deleteAsset',
						action: 'Delete an existing asset',
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
						operation: ['getAssetDetails', 'getAssetContent', 'getAssetStatus', 'getSpellcheckIssues', 'updateAsset', 'deleteAsset'],
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
				default: 20,
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
					url = `${baseUrl}/assets?apiKey=${encodeURIComponent(apiKey)}&websiteId=${encodeURIComponent(websiteId)}&limit=${limit}`;
					method = 'GET';
					break;
				}
				case 'getAssetDetails': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					url = `${baseUrl}/assets/${assetId}?apiKey=${encodeURIComponent(apiKey)}&websiteId=${encodeURIComponent(websiteId)}`;
					method = 'GET';
					break;
				}
				case 'getAssetContent': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					url = `${baseUrl}/assets/${assetId}/content?apiKey=${encodeURIComponent(apiKey)}&websiteId=${encodeURIComponent(websiteId)}`;
					method = 'GET';
					break;
				}
				case 'getAssetStatus': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					url = `${baseUrl}/assets/${assetId}/status?apiKey=${encodeURIComponent(apiKey)}&websiteId=${encodeURIComponent(websiteId)}`;
					method = 'GET';
					break;
				}
				case 'getSpellcheckIssues': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					url = `${baseUrl}/assets/${assetId}/spellcheck?apiKey=${encodeURIComponent(apiKey)}&websiteId=${encodeURIComponent(websiteId)}`;
					method = 'GET';
					break;
				}
				case 'createAsset': {
					content = this.getNodeParameter('content', i) as string;
					const contentType = this.getNodeParameter('contentType', i) as string;
					method = 'POST';
					url = `${baseUrl}/assets?apiKey=${encodeURIComponent(apiKey)}`;
					headers['Content-Type'] = 'application/x-www-form-urlencoded';
					body = `websiteId=${encodeURIComponent(websiteId)}&content=${encodeURIComponent(content)}&contentType=${encodeURIComponent(contentType)}`;
					break;
				}
				case 'updateAsset': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					content = this.getNodeParameter('content', i) as string;
					method = 'PUT';
					url = `${baseUrl}/assets/${assetId}?apiKey=${encodeURIComponent(apiKey)}`;
					headers['Content-Type'] = 'application/x-www-form-urlencoded';
					body = `websiteId=${encodeURIComponent(websiteId)}&content=${encodeURIComponent(content)}`;
					break;
				}
				case 'deleteAsset': {
					const assetId = this.getNodeParameter('assetId', i) as string;
					method = 'DELETE';
					url = `${baseUrl}/assets/${assetId}?apiKey=${encodeURIComponent(apiKey)}&websiteId=${encodeURIComponent(websiteId)}`;
					break;
				}
				default:
					throw new Error(`Unsupported operation: ${operation}`);
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
