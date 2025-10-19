import 'package:flutter/foundation.dart' show kIsWeb;
import 'package:flutter/material.dart';
import 'package:webview_flutter/webview_flutter.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  late final WebViewController _controller;
  bool _isLoading = true; // State to track loading
  bool _hasError = false; // State to track network errors

  @override
  void initState() {
    super.initState();
    // Initialize the controller only if not on the web
    if (!kIsWeb) {
      _controller = WebViewController()
        ..setJavaScriptMode(JavaScriptMode.unrestricted)
        ..setNavigationDelegate(
          NavigationDelegate(
            // Stop loading indicator when page is finished
            onPageFinished: (_) => setState(() => _isLoading = false),
            // Handle web loading errors
            onWebResourceError: (error) {
              setState(() {
                _hasError = true;
              });
            },
            // You can also handle navigation errors here
          ),
        )
        ..loadRequest(Uri.parse('https://www.prix.lematin.ma/'));
    }
  }

  @override
  Widget build(BuildContext context) {
    // Check if the platform is web
    if (kIsWeb) {
      // Display a placeholder widget on the web
      return Scaffold(
        appBar: AppBar(title: const Text('Accueil')),
        body: const Center(
          child: Text(
            'La vue web est désactivée sur cette plateforme.',
            style: TextStyle(fontSize: 18),
          ),
        ),
      );
    }

    // Display the WebView on mobile platforms
    // Use a Stack to show a loading indicator on top of the WebView
    return Stack(
      children: [
        // Only show WebView if there is no error
        if (!_hasError) WebViewWidget(controller: _controller),
        // Show loading indicator while loading
        if (_isLoading) const Center(child: CircularProgressIndicator()),
        // Show error message if loading failed
        if (_hasError)
          const Center(
            child: Padding(
              padding: EdgeInsets.all(16.0),
              child: Text(
                "Impossible de charger la page. Veuillez vérifier votre connexion internet.",
                textAlign: TextAlign.center,
              ),
            ),
          ),
      ],
    );
  }
}
