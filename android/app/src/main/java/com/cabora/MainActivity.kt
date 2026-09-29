package com.cabora

import android.content.Context
import android.content.res.Configuration
import android.graphics.Color
import android.os.Bundle
import android.view.WindowManager
import androidx.core.view.WindowCompat
import androidx.core.view.WindowInsetsControllerCompat
import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultNewArchitectureEntryPoint.fabricEnabled
import com.facebook.react.defaults.DefaultReactActivityDelegate

class MainActivity : ReactActivity() {

  override fun attachBaseContext(newBase: Context) {
    val config = Configuration(newBase.resources.configuration)
    config.fontScale = 1.0f
    val context = newBase.createConfigurationContext(config)
    super.attachBaseContext(context)
  }

  override fun applyOverrideConfiguration(overrideConfiguration: Configuration?) {
    if (overrideConfiguration != null) {
      overrideConfiguration.fontScale = 1.0f
    }
    super.applyOverrideConfiguration(overrideConfiguration)
  }

  override fun onConfigurationChanged(newConfig: Configuration) {
    newConfig.fontScale = 1.0f
    super.onConfigurationChanged(newConfig)
  }

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(null)
    WindowCompat.setDecorFitsSystemWindows(window, false)
    window.statusBarColor = Color.TRANSPARENT
    window.navigationBarColor = Color.TRANSPARENT
    window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS)
    WindowInsetsControllerCompat(window, window.decorView).apply {
      // Light nav/status icons so the gesture bar stays visible on splash navy.
      isAppearanceLightNavigationBars = false
      isAppearanceLightStatusBars = false
    }
  }

  override fun getMainComponentName(): String = "Cabora"

  override fun createReactActivityDelegate(): ReactActivityDelegate =
      DefaultReactActivityDelegate(this, mainComponentName, fabricEnabled)
}
