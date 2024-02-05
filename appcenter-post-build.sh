#!/usr/bin/env bash


echo "##[section]Starting: Sofy Upload Script"
echo ==============================================================================
echo Task         : Sofy upload script
echo Description  : Run a shell script using Bash
echo ==============================================================================

echo "SOFY subscription key = \"$SOFY_SUBSCRIPTION_KEY\""

if [ -z "$SOFY_SUBSCRIPTION_KEY" ]; then
    echo "Error: Variable 'SOFY_SUBSCRIPTION_KEY' is not set."
    # exit 1 // Exit causes build to fail
fi

echo "AppCenter Output Directory = \"$APPCENTER_OUTPUT_DIRECTORY\""

if [ "$APPCENTER_OUTPUT_DIRECTORY" ]; then
    BUILD_PATH_ANDROID="$APPCENTER_OUTPUT_DIRECTORY/app-release.apk"
    BUILD_PATH_IOS="$APPCENTER_OUTPUT_DIRECTORY/TheCoreUI.ipa"
    echo "Android build path = \"$BUILD_PATH_ANDROID\""
    echo "iOS build path = \"$BUILD_PATH_IOS\""
fi

if [ -f "${BUILD_PATH_ANDROID}" ]; then
    # GUID for the specific project on Sofy for Android 
    SOFY_APP_GUID="F3D5F904-67D2-485E-BE4A-54AF4222290D"
    BUILD_PATH=$BUILD_PATH_ANDROID
elif [ -f "${BUILD_PATH_IOS}" ]; then
    # GUID for the specific project on Sofy for iOS
    SOFY_APP_GUID="7F9EC261-2DD1-4570-9330-A0CE6D38DD3A"
    BUILD_PATH=$BUILD_PATH_IOS
else
    # Use path of last valid file
    # .aab files are not allowed on Sofy
BUILD_PATH=$(find . -path '*/debug/*' -prune -o \( -name '*.ipa' -or -path '*/release/app-release.apk' \) -print | tail -1)
fi

echo "SOFY app GUID = \"$SOFY_APP_GUID\""

if [ -z "$SOFY_APP_GUID" ]; then
    echo "Error: Variable 'SOFY_APP_GUID' is not set."  
    # exit 1 // Exit causes build to fail
fi


echo "AppCenter build to upload = \"$BUILD_PATH\""

if [ -f "${BUILD_PATH}" ]
then 
    echo "${BUILD_PATH} is a valid file";
    
    response=$(curl --location --request POST 'https://api.sofy.ai/api/AppTests/buildUpload' \
    --header "SubscriptionKey: $SOFY_SUBSCRIPTION_KEY" \
    --form "applicationFile=@\"$BUILD_PATH\"" \
    --form "ApplicationGuid=\"$SOFY_APP_GUID\"" \
    
    -w "%{response_code}")
    
    echo "$response" | jq

    # Extracting a specific field using jq
    app_hash=$(echo "$response" | jq -r '.AppHash')

    # Id if specific scheduled run to test
    # Replace with ID of specific scheduled run for the specific project
    if [ $app_hash ] && [ $SOFY_SCHEDULE_ID ]
    then 
        echo "Upload finished - Trigger schedule test run"

        schedule_response=$(curl --location --request POST "https://api.sofy.ai/api/CICD/ScheduleAutomatedTestRun" \
            --header "Content-Type: application/json" \
            --data-raw "{
                \"APIKey\":\"$SOFY_SUBSCRIPTION_KEY\",
                \"ScheduledID\": $SOFY_SCHEDULE_ID,
                \"AppHash\":\"$app_hash\"
                }" \
            -w "%{response_code}")

        echo "$schedule_response" | jq
    fi

else echo "${BUILD_PATH} is not valid";
fi

echo ==============================================================================
echo "##[section]Finishing: Sofy Upload Script"