import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:hanout_price/services/firebase_service.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import 'dart:io';

class AddPriceScreen extends StatefulWidget {
  final String barcode;
  const AddPriceScreen({super.key, required this.barcode});

  @override
  State<AddPriceScreen> createState() => _AddPriceScreenState();
}

class _AddPriceScreenState extends State<AddPriceScreen> {
  final _formKey = GlobalKey<FormState>();
  final _productNameController = TextEditingController();
  final _priceController = TextEditingController();
  final _storeNameController = TextEditingController();
  late final TextEditingController _barcodeController;

  File? _imageFile;
  bool _isLoading = false;

  @override
  void initState() {
    super.initState();
    _barcodeController = TextEditingController(text: widget.barcode);
  }

  @override
  void dispose() {
    _productNameController.dispose();
    _priceController.dispose();
    _storeNameController.dispose();
    _barcodeController.dispose();
    super.dispose();
  }

  Future<void> _pickImage(ImageSource source) async {
    try {
      final pickedFile = await ImagePicker().pickImage(
        source: source,
        imageQuality: 80,
        maxWidth: 800,
      );
      if (pickedFile != null) {
        setState(() {
          _imageFile = File(pickedFile.path);
        });
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text("Erreur lors de la sélection de l'image: $e"),
            backgroundColor: Colors.red,
          ),
        );
      }
    }
  }

  Future<void> _submitForm() async {
    if (_formKey.currentState!.validate()) {
      setState(() => _isLoading = true);

      try {
        final firebaseService = context.read<FirebaseService>();
        // 1. Safer price parsing, handling both '.' and ',' as decimal separators.
        final price = double.tryParse(
          _priceController.text.replaceAll(',', '.'),
        );

        // 2. Explicitly check for null price after parsing.
        if (price == null) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Format de prix invalide.')),
            );
          }
          return; // Stop execution if price is invalid
        }

        await firebaseService.addPriceContribution(
          productName: _productNameController.text,
          price: price,
          storeName: _storeNameController.text,
          barcode: _barcodeController.text.isNotEmpty
              ? _barcodeController.text
              : null,
          image: _imageFile,
        );

        if (!mounted) return;

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text(
              'Contribution ajoutée avec succès !',
            ), // Or use Theme.of(context).colorScheme.primary
            backgroundColor: Colors.green,
          ),
        );

        // 3. Add a small delay for better UX before popping the screen.
        await Future.delayed(const Duration(seconds: 1));
        if (mounted) Navigator.of(context).pop();
      } catch (e) {
        if (!mounted) return;
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erreur: $e'), backgroundColor: Colors.red),
        );
      } finally {
        if (mounted) {
          setState(() => _isLoading = false);
        }
      }
    }
  }

  Widget _buildImageSection() {
    return Column(
      children: [
        if (_imageFile != null)
          ClipRRect(
            borderRadius: BorderRadius.circular(16),
            child: Image.file(_imageFile!, height: 200, fit: BoxFit.cover),
          ),
        const SizedBox(height: 16),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceEvenly,
          children: [
            ElevatedButton.icon(
              onPressed: () => _pickImage(ImageSource.camera),
              icon: const Icon(Icons.camera_alt_outlined),
              label: const Text('Photo'),
            ),
            ElevatedButton.icon(
              onPressed: () => _pickImage(ImageSource.gallery),
              icon: const Icon(Icons.photo_library_outlined),
              label: const Text('Galerie'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildFormFields() {
    return Column(
      children: [
        TextFormField(
          controller: _productNameController,
          decoration: const InputDecoration(
            labelText: 'Nom du produit',
            border: OutlineInputBorder(),
          ),
          validator: (value) =>
              value == null || value.isEmpty ? 'Veuillez entrer un nom' : null,
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _priceController,
          decoration: const InputDecoration(
            labelText: 'Prix (MAD)',
            border: OutlineInputBorder(),
          ),
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          inputFormatters: [
            // 4. Use a more flexible regex for price input.
            FilteringTextInputFormatter.allow(RegExp(r'^\d*\.?\d{0,2}$')),
          ],
          validator: (value) {
            if (value == null || value.isEmpty) {
              return 'Veuillez entrer un prix';
            }
            if (double.tryParse(value) == null) {
              return 'Veuillez entrer un prix valide';
            }
            return null;
          },
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _storeNameController,
          decoration: const InputDecoration(
            labelText: 'Nom du magasin',
            border: OutlineInputBorder(),
          ),
          validator: (value) => value == null || value.isEmpty
              ? 'Veuillez entrer un nom de magasin'
              : null,
        ),
        const SizedBox(height: 16),
        TextFormField(
          controller: _barcodeController,
          decoration: const InputDecoration(
            labelText: 'Code-barres (Optionnel)',
            border: OutlineInputBorder(),
          ),
        ),
      ],
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Ajouter un prix'), centerTitle: true),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16.0),
          children: [
            _buildImageSection(),
            const SizedBox(height: 24),
            _buildFormFields(),
            const SizedBox(height: 32),
            FilledButton(
              onPressed: _isLoading ? null : _submitForm,
              style: FilledButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                textStyle: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              child: _isLoading
                  ? const SizedBox(
                      height: 24,
                      width: 24,
                      child: CircularProgressIndicator(
                        color: Colors.white,
                        strokeWidth: 3,
                      ),
                    )
                  : const Text('Soumettre la contribution'),
            ),
          ],
        ),
      ),
    );
  }
}
