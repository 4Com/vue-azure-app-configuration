export class VueAzureAppConfigurationOptions {
  constructor(
    public readonly connectionString: string,
    public featureFlagLabel: string
  ) {}
}
