export class MessageFormation {
	model: string;
	message: {
		exist?: string;
		custom: string;
		value: { model: string };
	};

	constructor(modelData: string) {
		this.model = modelData;
		this.message = {
			exist: 'Data already exist',
			custom: '',
			set value({ model, custom }: { model: string; custom: string }) {
				this.create = `${model} created successfully.`;
				this.update = `${model} updated successfully.`;
				this.fetch = `${model} fetched successfully.`;
				this.delete = `${model} deleted successfully.`;
				this.custom = custom;
			},
		};
		this.setModelValue();
	}

	setModelValue() {
		this.message.value = { model: this.model };
	}

	custom(custom: string) {
		this.message.custom = custom;
		return custom;
	}
}
