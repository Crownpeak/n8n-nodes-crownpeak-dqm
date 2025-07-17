import { CrownpeakDQM } from '../nodes/CrownpeakDQM/CrownpeakDQM.node';
import { INodePropertyOptions } from 'n8n-workflow';

describe('CrownpeakDQM Node', () => {
	const node = new CrownpeakDQM();

	it('should be defined', () => {
		expect(node).toBeDefined();
	});

	it('should contain correct node metadata', () => {
		expect(node.description.name).toBe('crownpeakDqm');
		expect(node.description.displayName).toBe('Crownpeak DQM');
		expect(Array.isArray(node.description.properties)).toBe(true);
		expect(node.description.credentials?.[0].name).toBe('crownpeakDqmApi');
	});

	it('should define all expected operations', () => {
		const operationOptions = node.description.properties.find((prop) => prop.name === 'operation');

		expect(operationOptions).toBeDefined();

		if (
			operationOptions &&
			Array.isArray(operationOptions.options)
		) {
			const values = operationOptions.options
				.filter((o): o is INodePropertyOptions => {
					return (
						typeof o === 'object' &&
						o !== null &&
						'value' in o &&
						typeof (o as any).value === 'string'
					);
				})
				.map((o) => o.value);

			expect(values).toEqual(expect.arrayContaining([
				'listAssets',
				'listWebsites',
				'listCheckpoints',
				'getAssetDetails',
				'getAssetContent',
				'createAsset',
				'getAssetStatus',
				'getSpellcheckIssues',
				'getAssetErrorsByCheckpoint',
				'updateAsset',
				'deleteAsset',
			]));
		} else {
			throw new Error('Operation options not found or improperly defined.');
		}

	});
});
