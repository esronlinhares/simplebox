export function tabIcon(routeName, focused) {
    const iconMap = {
      'Início': focused ? 'home' : 'home-outline',
      'Produto': focused ? 'cube' : 'cube-outline',
      'Endereço': focused ? 'location' : 'location-outline',
      'Retirar': focused ? 'qr-code' : 'qr-code-outline',
      'Perfil': focused ? 'person' : 'person-outline',
    };
    return iconMap[routeName];
  }

//teste