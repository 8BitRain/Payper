package com.payper;
import android.app.Application;

import com.facebook.CallbackManager;
import com.facebook.FacebookSdk;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
import com.facebook.appevents.AppEventsLogger;
import com.magus.fblogin.FacebookLoginPackage;

import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.bugsnag.BugsnagReactNative;
import com.github.alinz.reactnativewebviewbridge.WebViewBridgePackage;

import com.facebook.react.ReactApplication;
import fr.bamlab.rnimageresizer.ImageResizerPackage;
import com.cmcewen.blurview.BlurViewPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.microsoft.codepush.react.CodePush;
import com.microsoft.codepush.react.ReactInstanceHolder;

import java.util.Arrays;
import java.util.List;


public class MainApplication extends Application implements ReactApplication {

    private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

    protected static CallbackManager getCallbackManager() {
        return mCallbackManager;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        FacebookSdk.sdkInitialize(getApplicationContext());
        // If you want to use AppEventsLogger to log events.
        AppEventsLogger.activateApp(this);
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {



        // 2. Override the getJSBundleFile method in order to let
        // the CodePush runtime determine where to get the JS
        // bundle location from on each app start
        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        protected boolean getUseDeveloperSupport() {
            return com.payper.BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new ImageResizerPackage(),
                    new BlurViewPackage(),
                    new FBSDKPackage(mCallbackManager),
                    new RCTCameraPackage(),
                    new RNDeviceInfo(),
                    new WebViewBridgePackage(),
                    BugsnagReactNative.getPackage(),
                    new FacebookLoginPackage(),
                    new CodePush(BuildConfig.CODEPUSH_KEY, MainApplication.this, com.payper.BuildConfig.DEBUG),
                    new ReactNativeContacts()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}
