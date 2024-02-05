# React Native Project Setup

## Requirements before starting

1. Followed the [README](./README.md).
2. Have the necessary platform-specific app bundle identifiers.
3. Design Team have provided the iOS App Icons.
4. App designs are available on Zeplin - (Styles & Fonts).
5. API schema/collection is available.
6. Have access to the Apple Developer account and Google Play console.

---

### App Identifier

Update the App Identifiers throughout the app.

#### iOS

NOTE: BundleId for iOS is automatically registered on the connected Apple Developer account. Make sure XCode points to the clients' Developer Account before setting this. Once a BundleId is registered to any account it cannot be used in a different account, so this is very important.

1. Open project in Xcode.
2. With the App Target selected, in the `Signing & Capabilities` view, select the team for this project.
3. Update the `Bundle Identifier` with the correct value.

#### Android

1. In Visual Code Studio, update the `applicationId` in [android/app/build.gradle](./android/app/build.gradle).
2. To change the package structure if needed, change the `namespace` in [android/app/build.gradle](./android/app/build.gradle) and the folder structure in `./android/app/src/main/java` so a new directory is made for each part of the identifier (currently it is: com/thecoreui).

---

### App Icons

#### iOS

1. Open project in Xcode.
2. Navigate to the `Images.xcassets` folder within the main project folder (thecoreui).
3. Click on AppIcon, drag & drop the correct icon to match the required size.
4. Make sure all empty assset placeholders are filled in.

#### Android

1. Open project in Android Studio.
2. Follow the steps in the [link](https://developer.android.com/studio/write/image-asset-studio#access) to add the icons.
3. Need to create `adaptive and legacy launcher icons` as well as `notification icon` from the image resource provided by the Design Team.

---

### Splash Screen

Build this as a React Native screen within the `./src/navigators/app-setup-container.tsx` while the app is setting up.

---

### Apple Developer account - Devices & UDIDs

#### iOS

The [UDID spreadsheet](https://docs.google.com/spreadsheets/d/18UO1m1WGcT56ZGNw1bHCMLc61KLatmqMLRA3p15bujE/edit#gid=0) can be used to populate the devices list on the [project's](https://developer.apple.com/account/resources/devices/list) Apple Developer account.

Using another project's device list from AppCenter can be used to export our current active devices.

1. Check the list and update for with new devices and/or remove devices no longer required (i.e. when people leave)
2. Ensure all 3 columns are completed (Device ID, Device Name, Device Platform).
3. Then click File -> Download -> Tab-separated values.
4. Locate the download and rename the file to end in `.txt` , accept the Finder warning to use `.txt`.
5. In the Apple developer account for the project, click on Devices.
6. Upload the txt file to the Register Multiple Devices.
7. Press Continue and verify that all devices are there.

#### Android

N/A

---

### Configure 1Password

1. Setup a Vault in 1Password for this specific project. Follow example from existing projects.
2. Copy the `env.app` file from the `TD-General-Development` vault.
3. To add or change secrets, you need to edit the `env.app` file under the project in 1Password and run `yarn setup` again.
4. The AppCenter `appcenter-pre-build.sh` has to also be updated.

---

### Android Release Keystore

Generate a new keystore file folowwing [Android Studio instructions](https://developer.android.com/studio/publish/app-signing#generate-key)

1. It should be called `project-name-release.keystore`.
2. Alias should be `release`.
3. Generate a strong password through 1Password and store the keystore under the project vault. Look at existing projects for examples.
4. Configure in `build.gradle` under `signingConfigs.release` so that a release build is automatically signed with the new keystore.

---

### App Center

To add [AppCenter](https://docs.microsoft.com/en-us/appcenter), please follow the guide [here](https://docs.microsoft.com/en-us/appcenter/sdk/getting-started/react-native).

1. Login in to [AppCenter](https://appcenter.ms/orgs/The-Distance/applications) with the dev@thedistance.co.uk account so that the project is not linked to your personal account.
2. Click on `Add new app`.
3. Complete the App Name, OS (Android / iOS) and the Platform (React Native).
4. Click on `Build` and connect the repo through `BitBucket`. If it doesn't show, then the repo needs it's permissions amending to show on BitBucket.
5. A list of available committed branches will show. Click on the `spanner` on the right-hand side.
6. Configure the settings specific to the project so that all environment variables are specified.
7. Complete setup by clicking 'Save and Build'.
8. Repeat the above steps (2-7) but for the other Platform.

---

### Firebase Crashlytics & Analytics

Firebase is already set up. After replacing the Application Id (Android) and the Bundle Id (iOS), create the project on Firebase console and replace the config files for each platform, google-services.json (Android) and GoogleService-Info.plist (iOS).

---

### Import Zeplin Styles

1. Open Zeplin and navigate through to `Styleguide`.
2. Check that the ScaleProvider `config` in `App.tsx` is using the dimensions for the device specified in Zeplin.
3. Locate [StyleProvider](./src/providers/style/style-provider.tsx) in the style provider folder.
4. Add Colors, Fonts, TextStyles and use through the useStyle hook.
5. When adding colors, where possible, please use the rgba() color option as this makes it easier to update the alpha on it.
6. The StylesProvider uses the ThemeProvider from `react-native-elements` which takes a Theme structure of what the theme for all elements components should follow. An example is already provided from `TDFormsV2`

https://reactnativeelements.com/docs/

---

### Setup GraphQL Schema and Apollo

1. Update the [TypeDefs](./src/apollo/) file.
2. Using the examples in the [README_APOLLO](./src/providers/apollo/README_APOLLO.md). Update all the queries, mutations and implementations to follow the project schema.

---

### Setup Navigation Hierarchy

1. Define navigators under `./src/navigators/*`.
2. Add screen names in `constants.ts`

---

### Distribute to AppCenter

1. Push the code to AppCenter to make sure it builds on both platforms and that they both open/work as expected i.e. show the Hooray image.
