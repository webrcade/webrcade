import { isDev } from '@webrcade/app-common'

const localIp = "192.168.1.179";
const locGenesis = isDev() ? `http://${localIp}:3010` : 'app/genesis';
const locSms = locGenesis;
const loc2600 = isDev() ? `http://${localIp}:3050` : 'app/2600';
const loc7800 = isDev() ? `http://${localIp}:3020` : 'app/7800';
const locNes = isDev() ? `http://${localIp}:3030` : 'app/nes';
const locSnes = isDev() ? `http://${localIp}:3060` : 'app/snes';
const locDoom = isDev() ? `http://${localIp}:3040` : 'app/doom';

const checkRom = app => {
  if (app.props === undefined || app.props.rom === undefined) {
    throw new Error("Missing 'rom' property");
  }
}

let types = [
  {
    key: 'snes9x',
    name: 'Super Nintendo',
    //description: 'The Atari 2600, originally branded as the Atari Video Computer System (Atari VCS) until November 1982, is a home video game console developed and produced by Atari, Inc.',
    location: locSnes,
    thumbnail: "images/apps/snes-thumb.png",        
    background: "images/apps/snes-background.jpg",
    validate: checkRom              
  }, 
  {
    key: 'javatari',
    name: 'Atari 2600',
    //description: 'The Atari 2600, originally branded as the Atari Video Computer System (Atari VCS) until November 1982, is a home video game console developed and produced by Atari, Inc.',
    location: loc2600,
    thumbnail: "images/apps/2600-thumb.png",        
    background: "images/apps/2600-background.jpg",
    validate: checkRom
  }, {
    key: 'js7800',
    name: 'Atari 7800',
    //description: 'The Atari 7800 ProSystem, or simply the Atari 7800, is a home video game console officially released by Atari Corporation in 1986 as the successor to both the Atari 2600 and Atari 5200.',
    location: loc7800,
    background: 'images/apps/7800-background.jpg',
    thumbnail: 'images/apps/7800-thumb.png',
    validate: checkRom
  }, {
    key: 'genplusgx-md',
    name: 'Sega Genesis',
    // description: 'The Sega Genesis, known as the Mega Drive outside North America, is a 16-bit fourth-generation home video game console developed and sold by Sega.',
    location: locGenesis,
    background: 'images/apps/genesis-background.jpg',
    thumbnail: 'images/apps/genesis-thumb.png',
    validate: checkRom
  }, {
    key: 'fceux',
    name: 'Nintendo Entertainment System',
    // description: 'The Nintendo Entertainment System (NES) is an 8-bit third-generation home video game console produced by Nintendo.',
    location: locNes,
    background: 'images/apps/nes-background.png',
    thumbnail: 'images/apps/nes-thumb.png',
    validate: checkRom              
  }, {
    key: 'genplusgx-sms',
    name: 'Sega Master System',
    // description: 'The Sega Master System is a third-generation 8-bit home video game console manufactured by Sega.',
    location: locSms,
    background: 'images/apps/mastersystem-background.jpg',
    thumbnail: 'images/apps/mastersystem-thumb.png',
    validate: checkRom              
  }, {
    key: 'genplusgx-gg',
    name: 'Sega Game Gear',
    // description: 'The Sega Master System is a third-generation 8-bit home video game console manufactured by Sega.',
    location: locSms,
    background: 'images/apps/gamegear-background.png',
    thumbnail: 'images/apps/gamegear-thumb.png',
    validate: checkRom              
  }, {
    key: 'prboom',
    name: 'Doom Classic',
    // description: 'The Sega Master System is a third-generation 8-bit home video game console manufactured by Sega.',
    location: locDoom,
    background: 'images/apps/doom-background.jpg',
    thumbnail: 'images/apps/doom-thumb.png',
    validate: app => {
      if (app.props === undefined || app.props.game === undefined) {
        throw new Error("Missing 'game' property");
      }
    }
  }
];

const addAlias = (types, alias, typeKey) => {
  const {key, ...props} = types.filter(t => t.key === typeKey)[0];
  types.push({key: alias, absoluteKey: typeKey, ...props});      
}

// Aliases
addAlias(types, '2600', 'javatari');
addAlias(types, '7800', 'js7800');
addAlias(types, 'nes', 'fceux');
addAlias(types, 'snes', 'snes9x');
addAlias(types, 'genesis', 'genplusgx-md');
addAlias(types, 'sms', 'genplusgx-sms');
addAlias(types, 'gg', 'genplusgx-gg');
addAlias(types, 'doom', 'prboom');

const APP_TYPES = types;

export default APP_TYPES;