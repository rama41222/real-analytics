
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'dinushankanrg',
  applicationName: 'real-analytics',
  appUid: 'VgTKtfPs9Yw6JhRtrZ',
  orgUid: 'T3L8yTwYDgVMlJycdz',
  deploymentUid: '9a1adc45-f629-4be6-98e7-571f004f056b',
  serviceName: 'real-analytics',
  shouldLogMeta: true,
  shouldCompressLogs: true,
  disableAwsSpans: false,
  disableHttpSpans: false,
  stageName: 'production',
  serverlessPlatformStage: 'prod',
  devModeEnabled: false,
  accessKey: null,
  pluginVersion: '3.6.17',
  disableFrameworksInstrumentation: false
});

const handlerWrapperArgs = { functionName: 'real-analytics-production-data-calculation', timeout: 6 };

try {
  const userHandler = require('./src/modules/data-calculation/calculation.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}