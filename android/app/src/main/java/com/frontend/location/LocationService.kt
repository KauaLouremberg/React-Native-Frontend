package com.frontend.location

import com.frontend.BuildConfig
import com.frontend.R
import android.app.*
import android.content.Context
import android.content.Intent
import android.content.SharedPreferences
import android.os.Build
import android.os.IBinder
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.android.gms.location.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.RequestBody
import org.json.JSONObject

class LocationService : Service() {

    private val TAG = "LocationService"
    private val CHANNEL_ID = "location_channel_v1"
    private val PREFS_NAME = "location_service_prefs"
    private val PREF_KEY_TOKEN = "auth_token"

    private lateinit var fusedLocationClient: FusedLocationProviderClient
    private lateinit var locationCallback: LocationCallback
    private lateinit var prefs: SharedPreferences
    private val client = OkHttpClient()

    override fun onCreate() {
        super.onCreate()
        prefs = getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this)
        createNotificationChannel()
        buildLocationCallback()
    }

    private fun buildLocationCallback() {
        locationCallback = object : LocationCallback() {
            override fun onLocationResult(result: LocationResult) {
                val locations = result.locations
                if (locations.isNotEmpty()) {
                    val loc = locations[0]
                    val lat = loc.latitude
                    val lng = loc.longitude
                    val accuracy = loc.accuracy
                    val timestamp = loc.time

                    Log.d(TAG, "LocationCallback got: $lat, $lng (acc=$accuracy)")

                    // Envia ao backend nativo (OkHttp)
                    sendLocationNative(lat, lng, accuracy, timestamp)
                }
            }
        }
    }

    private fun sendLocationNative(lat: Double, lng: Double, accuracy: Float, timestamp: Long) {
        Thread {
            try {
                val token = prefs.getString(PREF_KEY_TOKEN, null)
                val json = JSONObject()
                json.put("latitude", lat)
                json.put("longitude", lng)
                json.put("accuracy", accuracy)
                json.put("timestamp", timestamp)
                val apiUrl = BuildConfig.API_URL
                val finalUrl = "${apiUrl.trimEnd('/')}/localizacao/"
                val body = RequestBody.create("application/json; charset=utf-8".toMediaTypeOrNull(), json.toString())
                val requestBuilder = Request.Builder()
                    .url(finalUrl)
                    .post(body)

                if (!token.isNullOrEmpty()) {
                    requestBuilder.addHeader("Authorization", "Bearer $token")
                }

                val request = requestBuilder.build()
                val response = client.newCall(request).execute()
                if (response.isSuccessful) {
                    Log.d(TAG, "Enviado com sucesso (native).")
                } else {
                    Log.w(TAG, "Falha ao enviar (native): ${response.code}")
                }
                response.close()
            } catch (e: Exception) {
                Log.e(TAG, "Erro envio native:", e)
            }
        }.start()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(CHANNEL_ID, "Localização", NotificationManager.IMPORTANCE_LOW)
            channel.description = "Notificações para rastreamento em segundo plano"
            val nm = getSystemService(NotificationManager::class.java)
            nm.createNotificationChannel(channel)
        }
    }

    private fun buildNotification(): Notification {
        val intent = packageManager.getLaunchIntentForPackage(packageName)
        val pendingIntent = PendingIntent.getActivity(
            this,
            0,
            intent,
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) PendingIntent.FLAG_IMMUTABLE else 0
        )

        return NotificationCompat.Builder(this, CHANNEL_ID)
            .setContentTitle("Rastreamento ativo")
            .setContentText("Seu app está enviando localização em segundo plano")
            .setSmallIcon(R.drawable.ic_location)
            .setContentIntent(pendingIntent)
            .setOngoing(true)
            .build()
    }

    private fun startLocationUpdates(intervalMs: Long = 10000L, smallestDisplacementMetres: Float = 10f) {
        val request = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, intervalMs)
            .setMinUpdateDistanceMeters(smallestDisplacementMetres)
            .setWaitForAccurateLocation(false)
            .build()

        try {
            fusedLocationClient.requestLocationUpdates(request, locationCallback, mainLooper)
            Log.d(TAG, "Location updates started")
        } catch (se: SecurityException) {
            Log.e(TAG, "Sem permissão de localização", se)
        } catch (e: Exception) {
            Log.e(TAG, "Erro ao iniciar updates", e)
        }
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        intent?.getStringExtra("token")?.let {
            prefs.edit().putString(PREF_KEY_TOKEN, it).apply()
        }

        val intervalMs = intent?.getLongExtra("intervalMs", 10000L) ?: 10000L
        val displacement = intent?.getFloatExtra("distanceFilter", 10f) ?: 10f

        val notification = buildNotification()
        startForeground(12345, notification)

        startLocationUpdates(intervalMs, displacement)
        return START_STICKY
    }

    override fun onDestroy() {
        super.onDestroy()
        fusedLocationClient.removeLocationUpdates(locationCallback)
    }

    override fun onBind(intent: Intent?): IBinder? = null
}
