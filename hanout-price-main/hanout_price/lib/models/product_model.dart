import 'package:cloud_firestore/cloud_firestore.dart';

class Product {
  final String id;
  final String name;
  final double price;
  final String storeName;
  final String? imageUrl;
  final String? barcode;
  final String addedBy;
  final Timestamp addedAt;

  Product({
    required this.id,
    required this.name,
    required this.price,
    required this.storeName,
    this.imageUrl,
    this.barcode,
    required this.addedBy,
    required this.addedAt,
  });

  factory Product.fromFirestore(DocumentSnapshot doc) {
    Map<String, dynamic> data = doc.data() as Map<String, dynamic>;
    return Product(
      id: doc.id,
      name: data['name'] ?? 'Nom inconnu',
      price: (data['price'] ?? 0.0).toDouble(),
      storeName: data['storeName'] ?? 'Magasin inconnu',
      imageUrl: data['imageUrl'],
      barcode: data['barcode'],
      addedBy: data['addedBy'] ?? '',
      addedAt: data['addedAt'] ?? Timestamp.now(),
    );
  }
}
