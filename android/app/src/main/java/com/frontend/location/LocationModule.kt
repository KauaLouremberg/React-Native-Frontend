package com.frontend.location

import android.content.Intent
import android.os.Build
import android.util.Log
import com.facebook.react.bridge.*

class LocationModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private val TAG = "LocationModule"
    private val serviceClass = LocationService::class.java

    override fun getName(): String = "LocationModule"

    @ReactMethod
    fun startService(token: String?, intervalMs: Double?, distanceFilter: Double?) {
        val ctx = reactApplicationContext
        try {
            val intent = Intent(ctx, serviceClass)
            if (token != null) intent.putExtra("token", token)
            intent.putExtra("intervalMs", intervalMs?.toLong() ?: 10000L)
            intent.putExtra("distanceFilter", distanceFilter?.toFloat() ?: 10f)

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                ctx.startForegroundService(intent)
            } else {
                ctx.startService(intent)
            }
            Log.d(TAG, "Service start requested")
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao iniciar service", e)
        }
    }

    @ReactMethod
    fun stopService() {
        val ctx = reactApplicationContext
        try {
            val intent = Intent(ctx, serviceClass)
            ctx.stopService(intent)
            Log.d(TAG, "Service stop requested")
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao parar service", e)
        }
    }
}
