import { isDev } from '@webrcade/app-common'

const localIp = "192.168.1.179";
const locGenesis = isDev() ? `http://${localIp}:3010` : 'app/genesis';
const locSms = locGenesis;
const loc7800 = isDev() ? `http://${localIp}:3020` : 'app/7800';
const locNes = isDev() ? `http://${localIp}:3030` : 'app/nes';

const checkRom = app => {
  if (app.props === undefined || app.props.rom === undefined) {
    throw new Error("Missing 'rom' property");
  }
}

let types = [
  {
    key: '2600',
    name: 'Atari 2600',
    //description: 'The Atari 2600, originally branded as the Atari Video Computer System (Atari VCS) until November 1982, is a home video game console developed and produced by Atari, Inc.',
    location: 'http://192.168.1.179:9000',
    thumbnail: "images/apps/2600-thumb2.png",        
    background: "" /*"images/apps/2600-background.jpg"*/,
    validate: app => true              
  }, {
    key: 'js7800',
    name: 'Atari 7800',
    //description: 'The Atari 7800 ProSystem, or simply the Atari 7800, is a home video game console officially released by Atari Corporation in 1986 as the successor to both the Atari 2600 and Atari 5200.',
    location: loc7800,
    background: 'images/apps/7800-background.jpg',
    thumbnail: 'images/apps/7800-thumb.png',
    validate: checkRom
  }, {
    key: 'wasm-genplus-md',
    name: 'Sega Genesis',
    // description: 'The Sega Genesis, known as the Mega Drive outside North America, is a 16-bit fourth-generation home video game console developed and sold by Sega.',
    location: locGenesis,
    background: 'images/apps/genesis-background.jpg',
    thumbnail: 'images/apps/genesis-thumb.png',
    validate: checkRom
  }, {
    key: 'em-fceux',
    name: 'Nintendo Entertainment System',
    // description: 'The Nintendo Entertainment System (NES) is an 8-bit third-generation home video game console produced by Nintendo.',
    location: locNes,
    background: 'images/apps/nes-background.png',
    thumbnail: 'images/apps/nes-thumb.png',
    validate: checkRom              
  }, {
    key: 'wasm-genplus-sms',
    name: 'Sega Master System',
    // description: 'The Sega Master System is a third-generation 8-bit home video game console manufactured by Sega.',
    location: locSms,
    background: 'images/apps/mastersystem-background.jpg',
    thumbnail: 'images/apps/mastersystem-thumb.png',
    validate: checkRom              
  }
];

const addAlias = (types, alias, typeKey) => {
  const {key, ...props} = types.filter(t => t.key === typeKey)[0];
  types.push({key: alias, absoluteKey: typeKey, ...props});      
}

// Aliases
addAlias(types, 'genesis', 'wasm-genplus-md');
addAlias(types, '7800', 'js7800');
addAlias(types, 'nes', 'em-fceux');
addAlias(types, 'sms', 'wasm-genplus-sms');

const APP_TYPES = types;

export default APP_TYPES;