const { withInfoPlist, withAndroidManifest, withPlugins } = require('@expo/config-plugins');

function withIbeacon(config) {
  return withPlugins(config, [
    // iOS: add location permission
    config => withInfoPlist(config, config => {
      config.modResults.NSLocationWhenInUseUsageDescription = 
        'We use iBeacon to detect nearby beacons for room identification.';
      return config;
    }),
    // Android: add fine location permission
    config => withAndroidManifest(config, config => {
      const manifest = config.modResults;
      manifest.manifest['uses-permission'] = manifest.manifest['uses-permission'] || [];
      manifest.manifest['uses-permission'].push({ $: { 'android:name': 'android.permission.ACCESS_FINE_LOCATION' }});
      return config;
    }),
    // More plugin steps: withPodfileProperties, withGradleProperties as needed...
  ]);
}

module.exports = withIbeacon;