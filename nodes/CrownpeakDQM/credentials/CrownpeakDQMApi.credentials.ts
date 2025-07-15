import {
	ICredentialType,
	NodePropertyTypes,
} from 'n8n-workflow';

export class CrownpeakDQMApi implements ICredentialType {
	name = 'crownpeakDqmApi';
	displayName = 'Crownpeak DQM API';
	icon = 'file:../crownpeak.svg' as const;
	documentationUrl = 'https://developer.crownpeak.com/DQM/cms/index.html';
	properties = [
		{
			displayName: 'API Key (required)',
			name: 'apiKey',
			type: 'string' as NodePropertyTypes,
			description: 'Your DQM API Key (required)',
			default: '',
		},
		{
			displayName: 'Website Identifier',
			name: 'websiteId',
			type: 'string' as NodePropertyTypes,
			description: 'Your DQM Website ID (required)',
			default: '',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string' as NodePropertyTypes,
			default: 'https://api.crownpeak.net/dqm-cms/v1',
			description: 'The DQM API URL (required)',
			typeOptions: {
				readOnly: true,
			},
		}
	];
	authenticate = {
		type: 'generic' as const,
		properties: {},
		baseUrl: '={{ $credentials.baseUrl }}',
	};
}

export const defaults = { name: 'Crownpeak DQM Node' };
