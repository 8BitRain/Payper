package com.example;
import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;

import com.rt2zz.reactnativecontacts.ReactNativeContacts;
import com.microsoft.codepush.react.CodePush;
import com.smixx.fabric.FabricPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {



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
            return com.example.BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
            new RNDeviceInfo(),
                    new FabricPackage(),
                    new CodePush("PhfwCJMZe1YxTjQq6ALKcf0XXO96VkksGQK3", MainApplication.this, com.example.BuildConfig.DEBUG),
                    new ReactNativeContacts()
            );
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }
}