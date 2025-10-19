import 'package:flutter/material.dart';
import 'package:hanout_price/auth_gate.dart';
import 'package:hanout_price/onboarding_screen.dart';
import 'package:hanout_price/services/cache_service.dart';

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen>
    with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  late Animation<double> _fadeAnimation;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1500),
    );
    _fadeAnimation = CurvedAnimation(
      parent: _animationController,
      curve: Curves.easeIn,
    );

    _animationController.forward();

    _navigateToNextScreen();
  }

  Future<void> _navigateToNextScreen() async {
    // Attend que l'animation soit visible
    await Future.delayed(const Duration(seconds: 3));

    if (!mounted) return;

    final cacheService = CacheService();
    final bool hasSeenOnboarding = await cacheService.hasSeenOnboarding();

    Navigator.of(context).pushReplacement(
      MaterialPageRoute(
        builder: (context) =>
            hasSeenOnboarding ? const AuthGate() : const OnboardingScreen(),
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFFF6F61), // Couleur corail
      body: FadeTransition(
        opacity: _fadeAnimation,
        child: Center(
          child: Image.asset('assets/images/logo_white.png', width: 150),
        ),
      ),
    );
  }
}
