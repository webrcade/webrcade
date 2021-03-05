const APPLIST = [
  {
    key: '2600',
    name: 'Atari 2600',
    description: 'The Atari 2600, originally branded as the Atari Video Computer System (Atari VCS) until November 1982, is a home video game console developed and produced by Atari, Inc.',
    location: 'http://192.168.1.179:9000',
    thumbnail: "images/apps/2600-thumb2.png",        
    background: "images/apps/2600-background.jpg",
    isValid: (app) => {return true;}              
  }, {
    key: '7800',
    name: 'Atari 7800',
    description: 'The Atari 7800 ProSystem, or simply the Atari 7800, is a home video game console officially released by Atari Corporation in 1986 as the successor to both the Atari 2600 and Atari 5200.',
    location: 'http://192.168.1.179:9000',
    background: 'images/apps/7800-background.jpg',
    thumbnail: 'images/apps/7800-thumb.png',
    isValid: (app) => {return true;}              
  }, {
    key: 'genesis',
    name: 'Sega Genesis',
    description: 'The Sega Genesis, known as the Mega Drive outside North America, is a 16-bit fourth-generation home video game console developed and sold by Sega.',
    location: 'http://192.168.1.179:3010',
    background: 'images/apps/genesis-background.jpg',
    thumbnail: 'images/apps/genesis-thumb.png',
    isValid: (app) => {return true;}              
  }, {
    key: 'nes',
    name: 'Nintendo NES',
    description: 'The Nintendo Entertainment System (NES) is an 8-bit third-generation home video game console produced by Nintendo.',
    location: 'alert("not implemented yet")',
    background: 'images/apps/nes-background2.png',
    thumbnail: 'images/apps/nes-thumb.png',
    isValid: (app) => {return true;}              
  }
];

export default APPLIST;