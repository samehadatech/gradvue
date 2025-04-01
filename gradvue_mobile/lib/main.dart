import 'package:flutter/material.dart';
import 'pages/home_page.dart'; // Ensure this import is correct

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Gradvue',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: HomePage(), // Ensure HomePage() is correctly used
    );
  }
}

