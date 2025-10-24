import 'package:connectivity_plus/connectivity_plus.dart';

class ConnectivityService {
  // Pattern Singleton
  static final ConnectivityService _instance = ConnectivityService._internal();
  factory ConnectivityService() => _instance;
  ConnectivityService._internal();

  Stream<ConnectivityResult> init() {
    return Connectivity().onConnectivityChanged.map(
      (List<ConnectivityResult> results) => results.first,
    );
  }
}
