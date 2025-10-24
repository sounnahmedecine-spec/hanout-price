import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:hanout_price/auth_screen.dart';
import 'package:hanout_price/screens/main_screen.dart'; // Correction du chemin
import 'package:hanout_price/services/firebase_service.dart';
import 'package:provider/provider.dart';

class AuthGate extends StatelessWidget {
  const AuthGate({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: StreamBuilder<User?>(
        stream: context.watch<FirebaseService>().authStateChanges,
        builder: (context, snapshot) {
          // User is logged in
          if (snapshot.hasData) {
            return const MainScreen(); // MainScreen a un constructeur const
          }
          // User is NOT logged in
          return const AuthScreen(); // AuthScreen a un constructeur const
        },
      ),
    );
  }
}
