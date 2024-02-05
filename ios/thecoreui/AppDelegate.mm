#import "AppDelegate.h"

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

#import <AppCenterReactNative.h>

#import <Firebase.h>
#import <GoogleMaps/GoogleMaps.h>

#import "RNSplashScreen.h"


@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  
  [AppCenterReactNative register];
  [FIRApp configure];
  
  self.moduleName = @"thecoreui";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
  
  BOOL success = [super application:application didFinishLaunchingWithOptions:launchOptions];

  [GMSServices provideAPIKey:@"AIzaSyDbLdwlvtOiTIvODfXNi9vWTMul-VTSgjs"];
  
  if (success) {
      RCTRootView *rootView = (RCTRootView *)self.window.rootViewController.view;
     // I wanted to make the backGround color consistent so that's why it's different here. You could also just cut
     // and paste the 'if (@availble(IOS 13.0`, *)) {...' block here.
     rootView.backgroundColor = [UIColor colorWithRed:0.0f
                                                green:91.0f/255.0f
                                                 blue:172.0f/255.0f
                                                alpha:1.0f];
    }

  [RNSplashScreen show];
  
  return success;
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@"index"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

- (BOOL)application:(UIApplication *)application
   openURL:(NSURL *)url
   options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options
{
  return [RCTLinkingManager application:application openURL:url options:options];
}

- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity
 restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler
{
 return [RCTLinkingManager application:application
                  continueUserActivity:userActivity
                    restorationHandler:restorationHandler];
}

/// This method controls whether the `concurrentRoot`feature of React18 is turned on or off.
///
/// @see: https://reactjs.org/blog/2022/03/29/react-v18.html
/// @note: This requires to be rendering on Fabric (i.e. on the New Architecture).
/// @return: `true` if the `concurrentRoot` feature is enabled. Otherwise, it returns `false`.
- (BOOL)concurrentRootEnabled
{
  return true;
}

@end
