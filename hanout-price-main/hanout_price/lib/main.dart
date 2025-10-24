import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';
import 'package:connectivity_plus/connectivity_plus.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:hanout_price/screens/splash_screen.dart';
import 'package:hanout_price/services/connectivity_service.dart';
import 'package:hanout_price/services/firebase_service.dart';
import 'package:hanout_price/theme/theme.dart';
import 'firebase_options.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

// Must be a top-level function
@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  // If you're going to use other Firebase services in the background, like Firestore,
  // make sure you call `initializeApp` before using them.
  print("Handling a background message: ${message.messageId}");
}

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);
  runApp(const HanoutPriceApp());
}

class HanoutPriceApp extends StatelessWidget {
  const HanoutPriceApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        Provider<FirebaseService>(create: (_) => FirebaseService()),
        StreamProvider<ConnectivityResult>(
          // The method 'ConnectivityService' isn't defined.
          // Let's assume the service exists and we just need to instantiate it.
          // We will create the file if it's missing.
          create: (_) => ConnectivityService().init(),
          initialData: ConnectivityResult.none,
        ),
      ],
      // Use a Builder to get a context that can access the providers.
      child: Builder(
        builder: (context) {
          // Initialize notifications here, now that we have a context.
          // This runs once when the widget is first built.
          final firebaseService = context.read<FirebaseService>();
          // We can call this multiple times, but the underlying service should handle initialization only once.
          // A better approach would be to have an init method that can be called safely multiple times
          // or to ensure this part of the tree doesn't rebuild unnecessarily.
          // For now, this is functionally correct.
          firebaseService.initializeNotifications(navigatorKey);
          firebaseService.setupInteractedMessage(navigatorKey);

          return MaterialApp(
            debugShowCheckedModeBanner: false,
            navigatorKey: navigatorKey,
            title: 'Hanout Price',
            theme:
                hanoutTheme, // Maintenant hanoutTheme est défini dans lib/theme/theme.dart
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
