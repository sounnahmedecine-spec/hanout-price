import 'package:flutter/material.dart';
import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:hanout_price/main.dart';
import 'package:hanout_price/screens/leaderboard_screen.dart';

class NotificationService {
  // Singleton pattern
  static final NotificationService _notificationService =
      NotificationService._internal();
  factory NotificationService() {
    return _notificationService;
  }
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  Future<void> init() async {
    // Android initialization
    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings(
          '@mipmap/ic_launcher',
        ); // Ensure you have this icon

    // iOS initialization
    const DarwinInitializationSettings initializationSettingsIOS =
        DarwinInitializationSettings();

    const InitializationSettings initializationSettings =
        InitializationSettings(
          android: initializationSettingsAndroid,
          iOS: initializationSettingsIOS,
        );

    await flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: onDidReceiveNotificationResponse,
    );
  }

  // Handle tap on notification when app is in the foreground
  void onDidReceiveNotificationResponse(
    NotificationResponse notificationResponse,
  ) {
    final String? payload = notificationResponse.payload;
    if (payload != null && navigatorKey.currentState != null) {
      debugPrint('notification payload: $payload');
      if (payload == '/leaderboard') {
        navigatorKey.currentState!.push(
          MaterialPageRoute(builder: (context) => const LeaderboardScreen()),
        );
      }
      // Add other routes here
    }
  }

  Future<void> showNotification({
    required String title,
    required String body,
    String? payload,
  }) async {
    const AndroidNotificationDetails androidPlatformChannelSpecifics =
        AndroidNotificationDetails(
          'hanout_price_channel', // id
          'Hanout Price Notifications', // title
          channelDescription:
              'Channel for Hanout Price app notifications', // description
          importance: Importance.max,
          priority: Priority.high,
          showWhen: false,
        );
    const NotificationDetails platformChannelSpecifics = NotificationDetails(
      android: androidPlatformChannelSpecifics,
    );
    await flutterLocalNotificationsPlugin.show(
      0,
      title,
      body,
      platformChannelSpecifics,
      payload: payload,
    );
  }
}
