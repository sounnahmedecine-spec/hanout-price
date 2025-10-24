import 'package:flutter/material.dart';
import 'package:hanout_price/auth_gate.dart';
import 'package:hanout_price/services/cache_service.dart';

class OnboardingScreen extends StatelessWidget {
  const OnboardingScreen({super.key});

  Future<void> _onGetStarted(BuildContext context) async {
    final cacheService = CacheService();
    await cacheService.setOnboardingSeen(true);

    if (context.mounted) {
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(builder: (context) => const AuthGate()),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);

    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Image.asset('assets/images/logo.png', height: 120),
              const SizedBox(height: 32),
              Text(
                'Bienvenue sur Hanout Price',
                textAlign: TextAlign.center,
                style: theme.textTheme.headlineMedium?.copyWith(
                  fontWeight: FontWeight.bold,
                  color: theme.primaryColor,
                ),
              ),
              const SizedBox(height: 16),
              Text(
                'Comparez les prix, partagez avec la communauté et économisez sur vos achats quotidiens au Maroc.',
                textAlign: TextAlign.center,
                style: theme.textTheme.titleMedium?.copyWith(
                  color: Colors.grey.shade700,
                ),
              ),
              const Spacer(),
              const Spacer(),
              FilledButton(
                onPressed: () => _onGetStarted(context),
                style: FilledButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  textStyle: const TextStyle(
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
                child: const Text('Commencer'),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }
}
