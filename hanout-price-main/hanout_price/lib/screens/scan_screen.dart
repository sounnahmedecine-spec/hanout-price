import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:hanout_price/screens/add_price_screen.dart';

class ScanScreen extends StatefulWidget {
  const ScanScreen({super.key});

  @override
  State<ScanScreen> createState() => _ScanScreenState();
}

class _ScanScreenState extends State<ScanScreen> {
  final MobileScannerController _scannerController = MobileScannerController();
  bool _isProcessing = false;

  void _onDetect(BarcodeCapture capture) {
    // Prevent multiple rapid scans
    if (_isProcessing) return;

    // Safely get the first barcode
    final Barcode? firstBarcode = capture.barcodes.isNotEmpty
        ? capture.barcodes.first
        : null;

    if (firstBarcode != null && firstBarcode.rawValue != null) {
      setState(() {
        _isProcessing = true;
      });

      final String barcodeValue = firstBarcode.rawValue!;
      debugPrint('Barcode found! $barcodeValue');

      // Navigate to the AddPriceScreen with the scanned barcode.
      // We use a push replacement to avoid coming back to the scanner with the back button.
      Navigator.of(context)
          .push(
            MaterialPageRoute(
              builder: (context) => AddPriceScreen(barcode: barcodeValue),
            ),
          )
          .then((_) {
            setState(
              () => _isProcessing = false,
            ); // Allow scanning again when user returns
          });
    }
  }

  @override
  void dispose() {
    _scannerController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Scanner le code-barres')),
      body: MobileScanner(controller: _scannerController, onDetect: _onDetect),
    );
  }
}
