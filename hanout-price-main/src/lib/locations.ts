export const locations = [
  { "name": "Agadir", "neighborhoods": ["Centre Ville", "Hay Mohammadi", "Founty", "Amsernat", "Charaf", "Les Amicales", "Adrar"] },
  { "name": "Casablanca", "neighborhoods": ["Maârif", "Anfa", "Gauthier", "Habous", "Ain Diab", "Hay Hassani", "Sidi Bernoussi", "Aïn Sebaâ"] },
  { "name": "Fès", "neighborhoods": ["Fès el-Bali (Médina)", "Fès el-Jdid", "Ville Nouvelle", "Zouagha", "Narjiss", "Agdal"] },
  { "name": "Marrakech", "neighborhoods": ["Médina", "Guéliz", "Hivernage", "Daoudiate", "Mhamid", "Sidi Youssef Ben Ali", "Palmeraie"] },
  { "name": "Meknès", "neighborhoods": ["Bassatine", "Hamria", "Zitoune", "Agdal", "Ville Nouvelle", "Sidi Bouzekri"] },
  { "name": "Rabat", "neighborhoods": ["Agdal", "Hay Riad", "Hassan", "Souissi", "L'Océan", "Yacoub El Mansour"] },
  { "name": "Tanger", "neighborhoods": ["Centre Ville", "Malabata", "Iberia", "Marchane", "Beni Makada", "Aouama"] }
];

export const flattenedLocations = locations.flatMap(city => 
  city.neighborhoods.map(neighborhood => ({
    value: `${city.name} - ${neighborhood}`.toLowerCase(),
    label: `${city.name} - ${neighborhood}`
  }))
);
