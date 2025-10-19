import 'package:flutter/material.dart';
import 'package:hanout_price/screens/login_screen.dart';
import 'package:hanout_price/screens/signup_screen.dart';

class AuthScreen extends StatefulWidget {
  const AuthScreen({super.key});

  @override
  State<AuthScreen> createState() => _AuthScreenState();
}

class _AuthScreenState extends State<AuthScreen> {
  bool _showLoginScreen = true;

  void toggleScreens() {
    setState(() {
      _showLoginScreen = !_showLoginScreen;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (_showLoginScreen) {
      return LoginScreen(onTap: toggleScreens);
    }
    return SignUpScreen(onTap: toggleScreens);
  }
}
