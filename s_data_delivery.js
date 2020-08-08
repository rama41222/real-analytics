
var serverlessSDK = require('./serverless_sdk/index.js');
serverlessSDK = new serverlessSDK({
  orgId: 'dinushankanrg',
  applicationName: 'real-analytics',
  appUid: 'VgTKtfPs9Yw6JhRtrZ',
  orgUid: 'T3L8yTwYDgVMlJycdz',
  deploymentUid: 'efa76de3-35e1-4384-abec-0afd01e2283c',
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

const handlerWrapperArgs = { functionName: 'real-analytics-production-data-delivery', timeout: 10 };

try {
  const userHandler = require('./src/modules/data-delivery/delivery.js');
  module.exports.handler = serverlessSDK.handler(userHandler.handler, handlerWrapperArgs);
} catch (error) {
  module.exports.handler = serverlessSDK.handler(() => { throw error }, handlerWrapperArgs);
}