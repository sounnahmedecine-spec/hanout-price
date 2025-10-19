import 'package:shared_preferences/shared_preferences.dart';

class CacheService {
  // --- Onboarding Keys ---
  static const String _onboardingKey = 'has_seen_onboarding';

  // --- Product Cache Keys (for Phase 2) ---
  static const String _lastProductKey = 'last_product_name';
  static const String _lastPriceKey = 'last_price_value';

  /// 🔹 Vérifie si l'utilisateur a déjà vu l'onboarding
  Future<bool> hasSeenOnboarding() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool(_onboardingKey) ?? false;
  }

  /// 🔹 Marque l'onboarding comme vu
  Future<void> setOnboardingSeen(bool value) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool(_onboardingKey, value);
  }

  /// 🔹 Sauvegarde du dernier produit scanné ou ajouté
  Future<void> saveLastProduct(String name, double price) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_lastProductKey, name);
    await prefs.setDouble(_lastPriceKey, price);
  }

  /// 🔹 Récupération du dernier produit enregistré
  Future<Map<String, dynamic>?> getLastProduct() async {
    final prefs = await SharedPreferences.getInstance();
    final name = prefs.getString(_lastProductKey);
    final price = prefs.getDouble(_lastPriceKey);

    if (name != null && price != null) {
      return {'name': name, 'price': price};
    }
    return null;
  }
}
