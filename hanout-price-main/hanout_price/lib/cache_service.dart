import 'package:shared_preferences/shared_preferences.dart';

/// A service class for managing local cache using SharedPreferences.
///
/// This class uses a singleton pattern to ensure a single instance throughout the app.
class CacheService {
  // Singleton pattern
  static final CacheService _instance = CacheService._internal();
  factory CacheService() {
    return _instance;
  }
  CacheService._internal();

  Future<SharedPreferences> get _prefs async => SharedPreferences.getInstance();

  // --- Generic Methods ---

  Future<void> saveString(String key, String value) async {
    final prefs = await _prefs;
    await prefs.setString(key, value);
  }

  Future<String?> getString(String key) async {
    final prefs = await _prefs;
    return prefs.getString(key);
  }

  Future<void> saveBool(String key, bool value) async {
    final prefs = await _prefs;
    await prefs.setBool(key, value);
  }

  Future<bool> getBool(String key, {bool defaultValue = false}) async {
    final prefs = await _prefs;
    return prefs.getBool(key) ?? defaultValue;
  }

  // --- App-specific examples ---

  static const String _onboardingSeenKey = 'onboarding_seen';

  Future<void> setOnboardingSeen(bool seen) async =>
      saveBool(_onboardingSeenKey, seen);

  Future<bool> isOnboardingSeen() async => getBool(_onboardingSeenKey);
}
