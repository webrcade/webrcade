const getDefaultFeed = () => {
  return {
    categories: [
      {
        title: "Atari 7800",
        longTitle: "Atari 7800 Games",
        background: "images/apps/7800-background.jpg",
        thumbnail: "images/apps/7800-thumb5.png",
        description: "The Atari 7800 ProSystem, or simply the Atari 7800, is a home video game console officially released by Atari Corporation in 1986 as the successor to both the Atari 2600 and Atari 5200.",
        items: [
          {
            title: "B*nQ",
            type: "7800",
            thumbnail: "https://www.mobygames.com/images/shots/l/529340-b-nq-atari-7800-screenshot-i-fell-off-the-board-my-such-language.png",
            background: "https://www.mobygames.com/images/shots/l/529341-b-nq-atari-7800-screenshot-i-completed-the-level.png",
            description: "b*nQ is an attempt to bring Q*bert to the Atari 7800. In the game, you must hop from one block to the next, changing its color, without getting stomped by the enemies or hopping off the pyramid. After you have changed all the block's colors, it is off to the next level.",
            props: {
              rom: "foo"
            }
          }, {
            title: "Basketbrawl",
            type: "7800",
            thumbnail: "https://www.mobygames.com/images/shots/l/56349-basketbrawl-atari-7800-screenshot-title-screen.gif",
            background: "https://www.mobygames.com/images/shots/l/56353-basketbrawl-atari-7800-screenshot-a-game-in-progress.gif",
            description: 'Basketbrawl is a video game released for the Atari 7800 in 1990, then later for the Atari Lynx in 1992. It is a sports simulation which allows hitting and fighting with other players. The name is a portmanteau of the words basketball and brawl. Basketbrawl is similar to the 1989 Midway arcade game Arch Rivals which had the tagline "A basket brawl!"',
            props: {
              rom: "foo"
            }
          }, {
            title: "Beef Drop",
            type: "7800",
            thumbnail: "https://www.mobygames.com/images/shots/l/311802-beef-drop-atari-7800-screenshot-level-2.png",
            background: "https://www.mobygames.com/images/shots/l/311800-beef-drop-atari-7800-screenshot-he-got-me.png",
            description: "Beef Drop is a port of the popular arcade game Burgertime, which Ken Siders first ported to the Atari 5200 and 8-bit computers. 7800 owners are in for a special treat, as the 7800 version is even truer to the original arcade experience, and features better graphics than the 5200/8-bit version, making the 7800 version the definitive release of Beef Drop.",
            props: {
              rom: "foo"
            }
          }, {
            title: "Commando",
            type: "7800",
            thumbnail: "https://www.mobygames.com/images/shots/l/56374-commando-atari-7800-screenshot-title-screen.gif",
            background: "https://www.mobygames.com/images/shots/l/56375-commando-atari-7800-screenshot-the-starting-location.gif",
            description: "You are a lone commando fighting against an overwhelming rebel force. You must make your way through several levels to reach the enemy headquarters and destroy it. Along the way you can gain bonus points by killing enemy officers and rescuing prisoners. One of four difficulty levels may be selected.",
            props: {
              rom: "foo"
            }
          }, {
            title: "Fatal Run",
            type: "7800",
            thumbnail: "https://www.mobygames.com/images/shots/l/56386-fatal-run-atari-7800-screenshot-title-screen.gif",
            background: "https://www.mobygames.com/images/shots/l/56387-fatal-run-atari-7800-screenshot-racing-to-the-next-city.gif",
            description: "In this post-apocalyptic driving/racing game you must travel to various towns delivering medicine, while on your way to a missile base which houses a rocket that can save the world. While driving through the 32 levels, you'll meet countless enemies who want to stop you from achieving your goal.",
            props: {
              rom: "foo"
            }
          }
        ]
      }
    ]
  }
};

export { getDefaultFeed }